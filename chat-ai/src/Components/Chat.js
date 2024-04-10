// import React, { useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//     faPaperclip,
//     faArrowRight,
//     faSpinner,
// } from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
// import toast from "react-hot-toast";

// function ChatContainer() {
//     const [images, setImages] = useState([]);
//     const [message, setMessage] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [isSending, setIsSending] = useState(false);

//     const handleImageChange = (e) => {
//         if (e.target.files) {
//             const filesArray = Array.from(e.target.files);
//             setImages((prevImages) => {
//                 const availableSlots = 5 - prevImages.length;
//                 const newImages = filesArray.slice(0, availableSlots);
//                 return [...prevImages, ...newImages];
//             });
//         }
//     };

//     const removeImage = (index) => {
//         setImages(images.filter((_, i) => i !== index));
//     };

//     const handleMessageChange = (e) => {
//         setMessage(e.target.value);
//     };

//     const sendMessage = async () => {
//         setIsSending(true);  

//         const newUserMessageContent = [
//             {
//                 type: "text",
//                 text: message,
//             },
//             ...images.map((file) => ({
//                 type: "image_url",
//                 image_url: { url: URL.createObjectURL(file) },
//             })),
//         ];

//         const newUserMessage = {
//             role: "user",
//             content: newUserMessageContent,
//         };

//         setMessages((prevMessages) => [...prevMessages, newUserMessage]);

//         const imagePromises = images.map((file) => {
//             return new Promise((resolve, reject) => {
//                 const reader = new FileReader();
//                 reader.onload = () => resolve(reader.result);
//                 reader.onerror = (error) => reject(error);
//                 reader.readAsDataURL(file);
//             });
//         });

//         const imageBase64Strings = await Promise.all(imagePromises);

//         const payload = {
//             messages: [
//                 {
//                     role: "user",
//                     content: [
//                         { type: "text", text: message },
//                         ...imageBase64Strings.map((base64) => ({
//                             type: "image_url",
//                             image_url: { url: base64 },
//                         })),
//                     ],
//                 },
//             ],
//         };

//         try {
//             const response = await axios.post("http://localhost:4000/api/openai", payload);

//             if (!response.data.success) {
//                 toast.error(response.data.error);
//             }

//             const newMessage = { ...response.data.message };
//             setMessages((prevMessages) => [...prevMessages, newMessage]);
//         } catch (error) {
//             toast.error("Failed to send message");
//         } finally {
//             setMessage("");
//             setImages([]);
//             setIsSending(false);
//         }
//     };

//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-y-auto p-4">
//                 {messages.map((message, idx) => (
//                     <div
//                         key={idx}
//                         className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"
//                             }`}
//                     >
//                         <div
//                             className={`rounded-lg p-2 max-w-xs lg:max-w-md ${message.role === "user"
//                                 ? "bg-purple-500 text-white"
//                                 : "bg-pink-500 text-white"
//                                 }`}
//                         >
//                             {Array.isArray(message.content) ? (
//                                 message.content.map((content, index) => {
//                                     if (content.type === "text") {
//                                         return <p key={index}>{content.text}</p>;
//                                     } else if (content.type === "image_url") {
//                                         return (
//                                             <img
//                                                 key={index}
//                                                 src={content.image_url.url}
//                                                 alt={`Uploaded by ${message.role}`}
//                                                 className="h-16 w-16 object-cover rounded-lg"
//                                             />
//                                         );
//                                     }
//                                 })
//                             ) : (
//                                 <p>{message.content}</p>
//                             )}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {/* Image preview row */}
//             <div className="p-4">
//                 {images.map((image, index) => (
//                     <div key={index} className="relative inline-block">
//                         <img
//                             src={URL.createObjectURL(image)}
//                             alt={`upload-preview ${index}`}
//                             className="h-16 w-16 object-cover rounded-lg mr-2"
//                         />
//                         <button
//                             onClick={() => removeImage(index)}
//                             className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
//                         >
//                             &times;
//                         </button>
//                     </div>
//                 ))}
//             </div>
//             <div className="flex items-center space-x-2 p-4 bg-white">
//                 <label className="flex justify-center items-center p-2 rounded-full bg-gray-200 text-gray-500 w-10 h-10 cursor-pointer">
//                     <FontAwesomeIcon icon={faPaperclip} className="h-5 w-5" />
//                     <input
//                         type="file"
//                         accept="image/*"
//                         multiple
//                         onChange={handleImageChange}
//                         className="hidden"
//                         disabled={isSending}
//                     />
//                 </label>
//                 <textarea
//                     className="flex-1 border p-2 rounded-lg focus:ring-0 resize-none"
//                     placeholder="Type your message here..."
//                     rows={1}
//                     value={message}
//                     onChange={handleMessageChange}
//                 ></textarea>
//                 <button
//                     className="flex justify-center items-center p-2 rounded-full bg-blue-600 text-white w-10 h-10"
//                     onClick={sendMessage}
//                     disabled={isSending}
//                 >
//                     {isSending ? (
//                         <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 fa-spin" />
//                     ) : (
//                         <FontAwesomeIcon icon={faArrowRight} className="h-5 w-5" />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default ChatContainer;


import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Video from "./Video.js";

function ChatContainer() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [isListening, setIsListening] = useState(false);


    let recognition;
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setMessage(transcript);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            toast.error("Speech recognition error: " + event.error);
            setIsListening(false);
        };
    } else {
        toast.error("This browser does not support speech recognition.");
    }

    useEffect(() => {
        const initialMessage = [
            {
                role: "assistant",
                content: "Hello! How can I assist you today?",
            },
        ];
        setMessages(initialMessage);
    }, []);

    const handleMessageChange = (e) => {
        setMessage(e.target.value);
    };

    const sendMessage = async () => {
        setIsSending(true);

        const newUserMessage = {
            role: "user",
            content: message,
        };

        setMessages((prevMessages) => [...prevMessages, newUserMessage]);

        const payload = {
            messages: [...messages, newUserMessage],
        };
        //https://chat-app-r44sb.ondigitalocean.app

        try {
            const response = await axios.post("https://chat-app-r44sb.ondigitalocean.app/chat", payload);
            if (!response.data.success) {
                toast.error(response.data.error);
            }

            const newMessage = response.data.assistantMessage;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
            toast.error("Failed to send message");
        } finally {
            setMessage("");
            setIsSending(false);
        }
    };
    const toggleListening = () => {
        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
        setIsListening(!isListening);
    };

    return (
        <div className="flex flex-col h-full">
            <Video />
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, idx) => (
                    <div
                        key={idx}
                        className={`flex mb-4 ${message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`rounded-lg p-2 max-w-xs lg:max-w-md ${message.role === "user"
                                ? "bg-purple-500 text-white"
                                : "bg-pink-500 text-white"
                                }`}
                        >
                            {/* Render content differently based on role */}
                            {message.role === "assistant" && message.content.startsWith("{") ? (
                                <pre>{JSON.stringify(message.content, null, 2)}</pre>
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex items-center p-4 bg-white">
                <textarea
                    className="flex-1 border p-2 rounded-lg focus:ring-0 resize-none"
                    placeholder="Type your message here..."
                    rows={1}
                    value={message}
                    onChange={handleMessageChange}
                ></textarea>
                <button onClick={toggleListening} className="mx-2">{isListening ? "Stop Listening" : "Start Listening"}</button>
                <button
                    className="flex justify-center items-center p-2 rounded-full bg-blue-600 text-white w-10 h-10 ml-2"
                    onClick={sendMessage}
                    disabled={isSending}
                >
                    {isSending ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ChatContainer;