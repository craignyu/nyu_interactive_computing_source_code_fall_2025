class GeminiHelper {

    constructor(apiKey, model) {
        // 1. Store API key (No localStorage lookup as requested)
        this.apiKey = apiKey;

        // 2. Store model choice (Defaulting to 2.5 Flash as requested)
        this.model = model || 'gemini-2.5-flash';

        // Conversation State
        this.conversations = {};
        this.conversationCounter = 0;

        this.ready = false;

        if (this.apiKey) {
            this.ready = true;
            console.log(`GeminiHelper: Ready using model '${this.model}'.`);
        } else {
            console.error("GeminiHelper: No API Key provided.");
        }
    }

    // --- P5.JS COMPATIBILITY ---
    async load(onProgress) {
        if (window._incrementPreload) window._incrementPreload();

        // Simulate a brief "loading" tick
        await new Promise(resolve => setTimeout(resolve, 100));

        if (this.ready) {
            if (onProgress) onProgress("Gemini Client Ready");
        } else {
            console.error("GeminiHelper: Failed to load (Missing Key)");
        }

        if (window._decrementPreload) window._decrementPreload();
    }

    // --- INTERNAL HELPERS ---

    _constructPayload(contents, config, systemPrompt) {
        const payload = {
            contents: contents,
            generationConfig: {
                temperature: config.temperature || 0.7
            }
        };

        // --- DEBUG: Log Config ---
        console.log("GeminiHelper: Constructing Payload with Config:", config);

        // FIX: Strict Integer Parsing
        if (config.max_tokens !== undefined && config.max_tokens !== null) {
            const tokens = parseInt(config.max_tokens);
            if (!isNaN(tokens)) {
                payload.generationConfig.maxOutputTokens = tokens;
            }
        }

        if (systemPrompt) {
            payload.systemInstruction = {
                parts: [{ text: systemPrompt }]
            };
        }

        if (config.jsonSchema) {
            payload.generationConfig.responseMimeType = "application/json";
            payload.generationConfig.responseSchema = config.jsonSchema.schema;
        }

        return payload;
    }

    // Standard Non-Streaming Fetch
    async _fetchGemini(payload) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

        console.log("GeminiHelper: Sending Request to:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();

        // Defensive checks
        if (!data.candidates || data.candidates.length === 0) {
            if (data.promptFeedback && data.promptFeedback.blockReason) {
                throw new Error(`Gemini Blocked: ${data.promptFeedback.blockReason}`);
            }
            throw new Error("Gemini returned no candidates.");
        }

        const firstCandidate = data.candidates[0];
        if (!firstCandidate.content || !firstCandidate.content.parts || firstCandidate.content.parts.length === 0) {
            const reason = firstCandidate.finishReason || "UNKNOWN";
            if (reason === "MAX_TOKENS") throw new Error("Gemini: Max Tokens reached before text generated.");
            throw new Error(`Gemini: Content blocked/empty. Reason: ${reason}`);
        }

        return firstCandidate.content.parts[0].text;
    }

    // --- NEW: Streaming Fetch ---
    async _fetchGeminiStream(payload, onChunk) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?key=${this.apiKey}`;

        console.log("GeminiHelper: Starting Stream Request to:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini Stream Error (${response.status}): ${errorText}`);
        }

        // Reader for the stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        let fullText = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Gemini returns a JSON array: [ {candidates...}, {candidates...} ]
            // We need to parse complete JSON objects out of the stream buffer
            while (true) {
                // Find the start of an object
                const startIndex = buffer.indexOf('{');
                if (startIndex === -1) break; // No object start found yet

                // Simple brace counting to find the matching end brace
                let balance = 0;
                let endIndex = -1;
                let inString = false;

                for (let i = startIndex; i < buffer.length; i++) {
                    // Toggle string state to ignore braces inside strings
                    if (buffer[i] === '"' && buffer[i - 1] !== '\\') {
                        inString = !inString;
                    }

                    if (!inString) {
                        if (buffer[i] === '{') balance++;
                        if (buffer[i] === '}') balance--;

                        // If balanced back to 0, we found the complete object
                        if (balance === 0) {
                            endIndex = i;
                            break;
                        }
                    }
                }

                if (endIndex !== -1) {
                    // Extract the JSON string
                    const jsonStr = buffer.substring(startIndex, endIndex + 1);
                    // Remove processed part from buffer
                    buffer = buffer.substring(endIndex + 1);

                    try {
                        const chunkData = JSON.parse(jsonStr);
                        if (chunkData.candidates && chunkData.candidates[0].content) {
                            const newText = chunkData.candidates[0].content.parts[0].text;
                            if (newText) {
                                fullText += newText;
                                if (onChunk) onChunk(newText, fullText);
                            }
                        }
                    } catch (e) {
                        console.warn("GeminiHelper: Stream Parse Error (ignoring chunk)", e);
                    }
                } else {
                    // Wait for more data to complete the object
                    break;
                }
            }
        }

        return fullText;
    }

    // --- CONVERSATION MANAGEMENT ---

    startConversation(args = {}) {
        const id = this.conversationCounter;
        this.conversations[id] = {
            systemPrompt: args.systemPrompt || "You are a helpful AI assistant.",
            history: []
        };
        this.conversationCounter++;
        return id;
    }

    getConversation(args) {
        if (!this.ready || !this.conversations[args.id]) return false;

        return this.conversations[args.id].history.map(msg => ({
            role: msg.role === 'model' ? 'assistant' : msg.role,
            content: msg.parts[0].text
        }));
    }

    async continueConversation(args) {
        if (!this.ready) return Promise.reject("GeminiHelper: Missing API Key.");
        if (!this.conversations[args.id]) return Promise.reject("Invalid conversation ID");

        const conv = this.conversations[args.id];

        // 1. Add User Message
        conv.history.push({
            role: "user",
            parts: [{ text: args.message }]
        });

        try {
            // 2. Prepare Payload
            const payload = this._constructPayload(
                conv.history,
                { temperature: args.temperature, max_tokens: args.max_tokens },
                conv.systemPrompt
            );

            let text = "";

            // 3. Execute Request (Stream vs Standard)
            if (args.onStream) {
                // Use the new streaming fetcher
                text = await this._fetchGeminiStream(payload, args.onStream);
            } else {
                // Use the standard fetcher
                text = await this._fetchGemini(payload);
            }

            // 4. Update History with Assistant Response
            conv.history.push({
                role: "model",
                parts: [{ text: text }]
            });

            return text;

        } catch (error) {
            console.error("Gemini Conversation Error:", error);
            throw error;
        }
    }

    async singleChatCompletion(args = {}) {
        if (!this.ready) return Promise.reject("GeminiHelper: Missing API Key.");

        try {
            const contents = [{
                role: "user",
                parts: [{ text: args.message }]
            }];

            const config = {
                temperature: args.temperature,
                max_tokens: args.max_tokens,
                jsonSchema: args.jsonSchema
            };

            const payload = this._constructPayload(
                contents,
                config,
                args.systemPrompt || "You are a helpful assistant."
            );

            // Support streaming for single completion too if needed
            if (args.onStream) {
                return await this._fetchGeminiStream(payload, args.onStream);
            } else {
                return await this._fetchGemini(payload);
            }

        } catch (error) {
            console.error("Gemini Execution Error:", error);
            throw error;
        }
    }
}

window.GeminiHelper = GeminiHelper;