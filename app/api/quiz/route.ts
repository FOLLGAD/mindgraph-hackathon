import { NextApiRequest, NextApiResponse } from 'next';

const apiKey = process.env.OPENAI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                // model: "gpt-4", // or "gpt-3.5-turbo"
                model: "gpt-4o-mini",
                response_format: { "type": "json_object" },
                messages: [
                    {
                        role: "system",
                        content: `Create five multiple-choice questions based on the topic: ${query}. Each question should have four options labeled A, B, C, D, and one correct answer. Return the result in the following JSON structure:

            Example:
            \`\`\`json
                    {
                        "question": "Your first question based on {topic} here.",
                        "options": {
                            "A": "Option A",
                            "B": "Option B",
                            "C": "Option C",
                            "D": "Option D"
                        },
                        "correctAnswer": "A/B/C/D"
                    }
            \`\`\`
          `
                    },
                    { role: "user", content: query }
                ],
                temperature: 0
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('OpenAI API Response:', data);
        const quizQuestions = JSON.parse(data.choices[0].message.content);

        res.status(200).json(quizQuestions);
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        res.status(500).json({
            message: 'Error generating quiz questions',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}