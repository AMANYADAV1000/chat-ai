import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            color: 'white',
            backgroundColor: '#8a2be2', // Adjust the color based on the exact color from the image
            textAlign: 'center',
            padding: '100px',
            paddingTop: '150px',
            paddingBottom: '150px',
        }}>
            
            <h1 style={{
                fontSize: '72px',
                lineHeight: '1.1',
                fontWeight: 'bold',
                margin: '0',
                padding: '0',
            }}>
                Edussory Labs
            </h1>
            <p style={{
                fontSize: '24px',
                marginTop: '60px',
                color: '#e5e4e2', // A lighter shade for the subtext
            }}>
                Edussory Labs helps students learn concepts using video format from their teacher AI avatars.
            </p>
            <p style={{
                fontSize: '24px',
                margin: '40px 0px',
            }}>
                Embark on a learning journey where complex concepts are simplified by AI-driven teacher avatars. Our interactive video platform brings personalized instruction to your screen, adapting to your unique learning style. Join us in the educational revolution—where intelligence becomes accessible, engaging, and inspiring.
            </p>
            <div style={{
                display: 'inline-block',
                margin: '20px',
                padding: '20px',
                backgroundColor: 'black',
                cursor: 'pointer',
            }} onClick={() => navigate('/signup')}>
                Try Edussory Labs
            </div>
            <div style={{
                display: 'inline-block',
                margin: '20px',
                padding: '20px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                border: '2px solid white',
            }} onClick={() => navigate('/demo')}>
                Check Our Demo
            </div>
            
        </div>
    );
};

export default HomePage;
