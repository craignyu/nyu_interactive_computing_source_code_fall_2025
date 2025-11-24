import { CreateMLCEngine } from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.79/lib/index.min.js";

class WebLLMHelper {

    // Model list: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts#L293
    // Some other models you can try
    //  - Llama-3.2-1B-Instruct-q4f32_1-MLC (one step down from the default model, faster, less capable)
    //  - Llama-3.2-3B-Instruct-q4f32_1-MLC (current default model)
    //  - Qwen2.5-1.5B-Instruct-q4f32_1-MLC
    //  - Phi-3.5-mini-instruct-q4f32_1-MLC
    constructor(modelId = "Llama-3.2-3B-Instruct-q4f32_1-MLC") {
        this.modelId = modelId;
        this.engine = null;
        this.ready = false;
        this.isProcessQueueRunning = false;
        this.requestQueue = [];
        this.conversationCounter = 0;
        this.conversations = {};

        // Trigger load immediately
        this.load((status) => {
            console.log("WebLLMHelper status:", status);
        });
    }

    async load(onProgress) {
        // --- P5 PRELOAD MAGIC ---
        if (window._incrementPreload) {
            window._incrementPreload();
        }

        const progressCallback = (report) => {
            if (onProgress) onProgress(report.text);
        };

        try {
            this.engine = await CreateMLCEngine(
                this.modelId,
                { initProgressCallback: progressCallback }
            );
            this.ready = true;
            console.log("WebLLMHelper: Model Loaded & Ready.");

        } catch (err) {
            console.error("WebLLMHelper: Model Load Error", err);
        } finally {
            if (window._decrementPreload) {
                window._decrementPreload();
            }
        }
    }

    startConversation(args = {}) {
        const id = this.conversationCounter;
        this.conversations[id] = [
            { role: "system", content: args.systemPrompt || "You are a helpful AI assistant." }
        ];
        this.conversationCounter++;
        return id;
    }

    getConversation(args) {
        if (!this.ready || !this.conversations[args.id]) return false;
        return this.conversations[args.id].map(turn => ({
            role: turn.role,
            content: turn.content
        }));
    }

    async continueConversation(args) {
        if (!this.ready) return Promise.reject("Model not ready");
        if (!this.conversations[args.id]) return Promise.reject("Invalid conversation ID");

        this.conversations[args.id].push({ role: "user", content: args.message });

        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                messages: this.conversations[args.id],
                temperature: args.temperature || 0.7,
                top_p: args.top_p || 1.0,
                max_tokens: args.max_tokens || undefined,
                onStream: args.onStream || null,
                resolve: resolve,
                reject: reject,
                historyCallback: (aiText) => {
                    this.conversations[args.id].push({ role: "assistant", content: aiText });
                }
            });
            this.processQueue();
        });
    }

    async singleChatCompletion(args = {}) {
        if (!this.ready) return Promise.reject("WebLLMHelper: Model not ready yet.");
        if (!args.message) return Promise.reject("WebLLMHelper: No message provided.");

        let systemPrompt = args.systemPrompt || "You are a helpful assistant.";

        // --- FIX 1: REFINED PROMPT INJECTION ---
        if (args.jsonSchema) {
             // We stringify ONLY the properties to avoid confusing the model with schema metadata
             const schemaProperties = args.jsonSchema.schema.properties;
             const schemaString = JSON.stringify(schemaProperties, null, 2);
             
             systemPrompt += `\n\nCRITICAL INSTRUCTION: You must output a valid JSON object.
             Do NOT output the schema definition (like "type": "object").
             Do NOT wrap the output in a "properties" key.
             The object must use these keys:
             ${schemaString}`;
        }

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: args.message }
        ];

        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                messages: messages,
                temperature: args.temperature || 0.7,
                top_p: args.top_p || 1.0,
                max_tokens: args.max_tokens || 500,
                jsonSchema: args.jsonSchema || undefined,
                onStream: args.onStream || null,
                resolve: resolve,
                reject: reject
            });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessQueueRunning || !this.ready) return;
        this.isProcessQueueRunning = true;

        while (this.requestQueue.length > 0) {
            const req = this.requestQueue.shift();

            try {
                let payload = {
                    messages: req.messages,
                    temperature: req.temperature,
                    top_p: req.top_p,
                    stream: true,
                };

                if (req.max_tokens) payload.max_tokens = req.max_tokens;

                if (req.jsonSchema) {
                    console.log("WebLLMHelper: Enforcing JSON Object Mode");
                    payload.response_format = { type: 'json_object' };
                    payload.stream = false; 
                }

                let finalResponseText = "";

                if (payload.stream) {
                    const chunks = await this.engine.chat.completions.create(payload);
                    for await (const chunk of chunks) {
                        const delta = chunk.choices[0]?.delta.content || "";
                        finalResponseText += delta;
                        if (req.onStream) req.onStream(delta, finalResponseText);
                    }
                } else {
                    const response = await this.engine.chat.completions.create(payload);
                    finalResponseText = response.choices[0].message.content;
                }

                // --- FIX 2: CLEANING & SMART UNWRAPPING ---
                if (req.jsonSchema) {
                    // 1. Clean Markdown
                    finalResponseText = finalResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

                    // 2. Smart Unwrap (The Safety Net)
                    try {
                        const parsed = JSON.parse(finalResponseText);
                        
                        // If the root has "properties" and NOT the actual keys we wanted
                        // (We check for the existence of the first key in the schema to be safe)
                        const firstExpectedKey = Object.keys(req.jsonSchema.schema.properties)[0];
                        
                        if (parsed.properties && !parsed[firstExpectedKey]) {
                            console.warn("WebLLMHelper: Model wrapped output in 'properties'. Unwrapping...");
                            finalResponseText = JSON.stringify(parsed.properties);
                        } else if (parsed.type === "object" && parsed.properties) {
                             // Handles the { type: "object", properties: {...} } case
                             console.warn("WebLLMHelper: Model output full schema structure. Unwrapping...");
                             finalResponseText = JSON.stringify(parsed.properties);
                        }
                    } catch (e) {
                        // If parsing fails here, we return the raw text so the user sees the error
                        // instead of crashing inside the helper.
                    }
                }

                if (req.historyCallback) req.historyCallback(finalResponseText);
                req.resolve(finalResponseText);

            } catch (err) {
                console.error("WebLLM Execution Error:", err);
                req.reject(err);
            }
        }

        this.isProcessQueueRunning = false;
    }
}

window.WebLLMHelper = WebLLMHelper;