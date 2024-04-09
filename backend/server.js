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







//mongodb+srv://umang:hSIDQrwaxRsbaWwX@cluster01.2gtklha.mongodb.net/?retryWrites=true&w=majority
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cors = require('cors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const User = require('./Modal/User'); // Import the User model
const bcrypt = require('bcrypt');
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

// Session setup
app.use(session({
    secret: 'secret', // You should use a more secure secret in production
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Configure the Google strategy for use by Passport
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    (accessToken, refreshToken, profile, cb) => {
        // Here, you would typically find or create a user in your database
        console.log(profile);
        return cb(null, profile);
    }
));

// Define routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home or to another page
        res.redirect('/chat'); // Adjust this as needed
    });



// Signup route
app.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = new User({ email, password });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Authentication failed');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Authentication failed');
        }

        // Here, you can set up your session or token-based authentication
        // For now, we'll just return a success message
        res.send('Login successful');
    } catch (error) {
        res.status(500).send('Error logging in');
    }
});


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

        
        const contentToSave = choices[0].message.content; // Extract the content field which is the text you want to save

        // Save the content as a text file
        const textFilePath = path.resolve('./response.txt');
        await fs.writeFile(textFilePath, contentToSave);


        try {
            console.error('GOING FOR SAVE SPEECH');

            await generateAndSaveSpeech(contentToSave);
        } catch (error) {
            console.error('Failed to generate speech:', error);
            // You can choose to handle this error in a different way, e.g., by not generating the speech file
        }

        res.status(200).json({ assistantMessage });
    } catch (error) {
        console.log('INSIDE chat error');

        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
});

async function generateAndSaveSpeech(text) {
    // Generate speech from text
    const mp3Buffer = await generateSpeechFromText(text);
    const speechFile = path.resolve("./speech.mp3");

    // Save the speech audio as an MP3 file
    await fs.writeFile(speechFile, mp3Buffer);
    console.log(`Speech file saved at: ${speechFile}`);
}

async function generateSpeechFromText(text) {
    try {
        console.log('Going for audio generation in text to speech block');

        const response = await axios.post('https://api.openai.com/v1/audio/speech',
        {
            model: "tts-1",
            input: text,
            voice: "alloy",
        },
        {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'audio/mpeg'
                },
                responseType: 'arraybuffer'  // This ensures you get the raw binary data
            }
        );
        console.log('AUDIO GENERATE DONE -- ABOVE BUFFER', response.data);

        // Convert the array buffer from the response to a Buffer
        const buffer = Buffer.from(response.data);
        return buffer;

 
    } catch (error) {
        console.error('Failed to generate speech:', error);
        throw error;
    }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});