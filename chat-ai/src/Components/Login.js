import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const responseGoogle = (response) => {
        console.log(response);
        onLoginSuccess(response);
    };

    const handleLoginClick = async () => {
        try {
            const response = await axios.post('https://chat-app-r44sb.ondigitalocean.app/login', { email, password });
            console.log(response.data);
            onLoginSuccess(response.data); // Assuming you handle the login state in the parent component
            navigate('/chat'); // Navigate to a protected route or home page after login
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            // Optionally, show an error message to the user here
        }
    };

    const handleSignUpClick = () => {
        navigate('/signup'); // Replace with your actual sign-up route
    };

    return (
        <div className="max-w-sm mx-auto text-center p-6 shadow-lg rounded-lg mt-20">
            <h2 className="text-2xl font-semibold mb-6">Welcome back</h2>
            <input
                type="email"
                placeholder="Email address"
                className="w-full p-3 border border-gray-300 rounded mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                onClick={handleLoginClick}
                className="w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600">
                Continue
            </button>
            <p className="text-sm mb-4">
                Don't have an account?{' '}
                <button onClick={handleSignUpClick} className="text-blue-500 hover:underline">
                    Sign up
                </button>
            </p>
            <p className="my-4 text-gray-500">OR</p>
            <GoogleLogin
                clientId="716287854139-h0253hbiffukv1uhdm71p28ol06s7050.apps.googleusercontent.com"
              //  buttonText="Continue with Googles"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className="w-full bg-red-500 text-white p-3 rounded mb-4 hover:bg-red-600"
                    >
                        Continue with Google
                    </button>
                )}
            />
            {/* Add buttons for other providers here */}
        </div>
    );
};

export default Login;
