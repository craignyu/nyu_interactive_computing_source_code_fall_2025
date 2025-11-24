// our LLM helper and conversation variable
let llmHelper;
let conversationId;

// speech & text variables
let myVoice;
let myRec;

// state management for handling the audio conversation with the AI agent
let currentState = "IDLE"; // IDLE, LISTENING, THINKING, SPEAKING
let currentSpokenText = ""; // The text currently being displayed
let fullResponseText = "";  // The full text the AI is planning to say

function preload() {
    llmHelper = new WebLLMHelper();
}

function setup() {
    createCanvas(600, 400);
    textSize(24);
    
    // IMPORTANT: This aligns text horizontally AND vertically to the center
    textAlign(CENTER, CENTER);    
    rectMode(CENTER);

    // 1. Initialize Conversation
    conversationId = llmHelper.startConversation({
        systemPrompt: 'You are a witty assistant. You answer in one short sentence.'
    });

    // 2. Setup Text to Speech (Output)
    myVoice = new p5.Speech();

    // Hook for word boundaries (allows us to display words one at a time)
    myVoice.utterance.onboundary = (event) => {
        currentSpokenText = fullResponseText.substring(0, event.charIndex + event.charLength);
    };

    myVoice.onEnd = () => {
        currentState = "IDLE";
    };

    // 3. Setup Speech to Text (Input)
    myRec = new p5.SpeechRec();
    myRec.continuous = false; 
    myRec.interimResults = false;
    myRec.onResult = handleUserSpeech;
    myRec.onStart = () => { currentState = "LISTENING"; };
}

function draw() {
    background(30);
    fill(255);
    noStroke();

    // --- VISUALIZE STATES ---
    if (currentState === "IDLE") {
        fill(100, 255, 100);
        text("Click mouse to speak", width / 2, height / 2);

    } else if (currentState === "LISTENING") {
        fill(255, 100, 100);
        circle(width / 2, height / 2, 100 + sin(frameCount * 0.1) * 20); 
        fill(255);
        text("Listening...", width / 2, height / 2);

    } else if (currentState === "THINKING") {
        fill(100, 100, 255);
        push();
        translate(width / 2, height / 2);
        rotate(frameCount * 0.05);
        rect(0, 0, 50, 50);
        pop();
        text("Thinking...", width / 2, height / 2 + 60);

    } else if (currentState === "SPEAKING") {
        
        textWrap(WORD); // Ensure words break to new lines
        text(currentSpokenText, width / 2, height / 2, width - 100, height - 100);
    }
}

function mousePressed() {
    if (currentState === "IDLE") {
        userStartAudio(); 
        myRec.start();
    }
}

async function handleUserSpeech() {
    if (!myRec.resultValue) return;

    let userText = myRec.resultString;
    console.log("User said:", userText);

    currentState = "THINKING";

    const response = await llmHelper.continueConversation({
        id: conversationId,
        message: userText
    });

    fullResponseText = response; 
    currentSpokenText = "";      
    currentState = "SPEAKING";

    myVoice.speak(response);
}