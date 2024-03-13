const express = require('express');
const axios = require('axios');
const { z } = require('zod');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json()); 

const textContentSchema = z.object({
    type: z.literal("text"),
    text: z.string(),
});

const imageContentSchema = z.object({
    type: z.literal("image_url"),
    image_url: z.object({
        url: z.string().url(),
    }),
});

const contentSchema = z.union([textContentSchema, imageContentSchema]);

const messageSchema = z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.array(contentSchema),
});

const chatRequestSchema = z.object({
    messages: z.array(messageSchema),
});

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

app.post('/api/openai', async (req, res) => {
    console.log('REQ BODY', req.body);

    const parsedRequest = chatRequestSchema.safeParse(req.body);
    console.log('REQ BODY- ParsedRequest', parsedRequest);

    if (!parsedRequest.success) {
        console.log("Invalid schema", parsedRequest.error);
        return res.status(400).json({ error: "Invalid schema", success: false });
    }

    const clonedMessages = parsedRequest.data.messages.map((message) => ({

        ...message,
        content: message.content.map((content) => {
            if (content.type === "image_url") {
                return {
                    type: content.type,
                    image_url: {
                        url: content.image_url.url,
                    },
                };
            }
            return content;
        }),
    }));

    // console.log("clonedMessages", JSON.stringify(clonedMessages));

    const payload = {
        model: "gpt-4-vision-preview",
        messages: clonedMessages,
        max_tokens: 300,
    };
    console.log('paylaod', payload);
    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    console.log('headers', headers);


    axios.post(OPENAI_URL, payload, { headers })
        .then((response) => {
            const firstMessage = response.data.choices[0].message;
            console.log("firstMessage", firstMessage);

            res.json({ success: true, message: firstMessage });
        })
        .catch((error) => {
            console.log("error in last block of server.js - call openai api", error);
            res.status(500).json({ success: false, message: null });
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
