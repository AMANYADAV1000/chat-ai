// const express = require('express');
// const axios = require('axios');
// const { z } = require('zod');
// const cors = require('cors');
// require('dotenv').config();
// const app = express();

// app.use(express.json());

// app.use(cors({
//     origin: true,
//     credentials: true,
// }));

// const textContentSchema = z.object({
//     type: z.literal("text"),
//     text: z.string(),
// });

// const imageContentSchema = z.object({
//     type: z.literal("image_url"),
//     image_url: z.object({
//         url: z.string().url(),
//     }),
// });

// const contentSchema = z.union([textContentSchema, imageContentSchema]);

// const messageSchema = z.object({
//     role: z.enum(["user", "assistant", "system"]),
//     content: z.array(contentSchema),
// });

// const chatRequestSchema = z.object({
//     messages: z.array(messageSchema),
// });

// const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
// //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
// app.post('/api/openai', async (req, res) => {
//     console.log('REQ BODY', req.body);

//     const parsedRequest = chatRequestSchema.safeParse(req.body);
//     console.log('REQ BODY- ParsedRequest', parsedRequest);

//     if (!parsedRequest.success) {
//         console.log("Invalid schema", parsedRequest.error);
//         return res.status(400).json({ error: "Invalid schema", success: false });
//     }

//     const clonedMessages = parsedRequest.data.messages.map((message) => ({

//         ...message,
//         content: message.content.map((content) => {
//             if (content.type === "image_url") {
//                 return {
//                     type: content.type,
//                     image_url: {
//                         url: content.image_url.url,
//                         detail: low
//                     },
//                 };
//             }
//             return content;
//         }),
//     }));

//     console.log("clonedMessages", clonedMessages);

//     const payload = {
//         model: "gpt-4-vision-preview",
//         messages: clonedMessages,
//         max_tokens: 300,
//     };
//     console.log('paylaod', payload);
    
//     //console.log('headers', headers);

//     // const axiosConfig = {
//     //     timeout: 5000, // Timeout in milliseconds (e.g., 5 seconds)
//     //     // Other Axios options...
//     // };

//     try {
//         // Note: axiosConfig is merged into the third argument with headers
//         const response = await axios.post(OPENAI_URL, payload, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//             },
//             timeout: 10000, // This is the correct way to set the timeout
//         });
//         console.log("RESPONSE", response.data);

//         const firstMessage = response.data.choices[0].message;
//         console.log("firstMessage", firstMessage);
//         res.json({ success: true, message: firstMessage });
//     } catch (error) {
//         console.log("error in last block of server.js - call openai api", error);
//         res.status(500).json({ success: false, message: "in open api call block", error });
//     }
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
console.log('INSIDE');

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

app.post('/chat', async (req, res) => {
    console.log('INSIDE chat route');

    try {
        const { messages } = req.body;
        console.log('REQ BODY', req.body);
        console.log('MESSAGES', messages);


        const response = await axios.post(
            OPENAI_API_URL,
            {
                model: 'gpt-3.5-turbo',
                messages,
                max_tokens: 1000,
                temperature: 0.5,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );
        console.log('response', response.data);


        const { choices } = response.data;
        console.log('choices', choices);

        const assistantMessage = choices[0].message;
        console.log('ASSISTANT MESSAGE AFTER API RESPONSE', assistantMessage);


        res.status(200).json({ assistantMessage });
    } catch (error) {
        console.log('INSIDE chat error');

        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});