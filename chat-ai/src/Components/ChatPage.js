import React from 'react';
import ChatContainer from './Chat'; // Adjust the import path as necessary
import coolAIBackground from '../images/cool_ai_bg.png';

const ChatPageLayout = () => {
    return (
        <main
            className="flex flex-col items-center justify-center w-full min-h-screen p-4 gap-4 md:flex-row md:p-8"
            style={{
                backgroundImage: `url(${coolAIBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full max-w-xl mx-auto md:w-1/2 md:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                <div className="card bg-white p-6 shadow-lg rounded-lg h-[85vh]">
                    <ChatContainer />
                </div>
            </div>
        </main>
    );
};

export default ChatPageLayout;
