require('dotenv').config();  // Load environment variables

const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function testOpenAI() {
    if (!OPENAI_API_KEY) {
        console.error("❌ Error: API key is missing. Check your .env file.");
        return;
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4o',  // Best for accuracy, use gpt-3.5-turbo if needed
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert DELF B2 examiner. Generate a writing prompt in French for a DELF B2 written production task.
                        
Each prompt must strictly follow this structure:
1️⃣ **Format:** Choose between **lettre formelle, essai argumentatif, compte rendu critique, or rapport/proposition**.
2️⃣ **Task:** Write a precise exam-style instruction in 3-4 sentences.
3️⃣ **Word Limit:** Include a minimum word count (e.g., 250 mots minimum).
4️⃣ **Context (if needed):** Mention a recipient (e.g., "Écrivez une lettre au maire…").

**Example prompts:**
- *Lettre formelle:* _Écrivez une lettre au maire de votre ville pour exprimer vos inquiétudes face à la pollution et proposer des solutions concrètes._ (250 mots minimum)
- *Essai argumentatif:* _"L’intelligence artificielle va-t-elle remplacer les travailleurs humains ?" Discutez avec des arguments développés._ (250 mots minimum)
- *Compte rendu critique:* _Vous avez assisté à une conférence sur l’impact des réseaux sociaux. Rédigez un compte rendu critique._ (250 mots minimum)

⚠ **Strictly follow this format. Do NOT add explanations, unnecessary text, or multiple prompts. Output ONLY ONE prompt per request.**`
                    },
                    {
                        role: 'user',
                        content: "Generate a DELF B2 writing prompt."
                    }
                ],
                max_tokens: 100
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ DELF B2 Prompt Generated:");
        console.log(response.data.choices[0].message.content);
    } catch (error) {
        console.error("❌ OpenAI API Error:", error.response?.data || error.message);
    }
}

// Run the test function
testOpenAI();
