// Load environment variables and required packages
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());  // Allow JSON request bodies
app.use(cors());  // Enable frontend to communicate with backend

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Function to generate a DELF B2-style writing prompt
async function generateDELFPrompt() {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo', // Use 'gpt-4o' for better accuracy
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert DELF B2 examiner. Generate a writing prompt in French for a DELF B2 written production task.
                        
Each prompt must strictly follow this structure:
1️⃣ **Format:** Choose between **lettre formelle, essai argumentatif, compte rendu critique, or rapport/proposition**.
2️⃣ **Task:** Write a precise exam-style instruction in 3-4 sentences.
3️⃣ **Word Limit:** Include a 250 minimum word count (e.g., 250 mots minimum).
4️⃣ **Context (if needed):** Mention a recipient (e.g., "Écrivez une lettre au maire…").

🔹 **Example prompts:**
- _Écrivez une lettre au maire de votre ville pour exprimer vos inquiétudes face à la pollution et proposer des solutions concrètes._ (250 mots minimum)
- _L’intelligence artificielle va-t-elle remplacer les travailleurs humains ?" Discutez avec des arguments développés._ (250 mots minimum)
- _Vous avez assisté à une conférence sur l’impact des réseaux sociaux. Rédigez un compte rendu critique._ (250 mots minimum)

⚠ **Strictly follow this format. Do NOT add explanations, unnecessary text, or multiple prompts. Output ONLY ONE prompt per request.**`
                    }
                ],
                max_tokens: 150  // Increased to prevent cut-off responses
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("❌ Error fetching AI-generated prompt:", error);
        return "Erreur: Impossible de générer un sujet d'écriture. Réessayez plus tard.";
    }
}

// API endpoint to get a DELF B2 prompt
app.post('/generate-prompt', async (req, res) => {
    const prompt = await generateDELFPrompt();
    res.json({ prompt });
});

// Start the backend server
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
