import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login'; // Import the GoogleLogin component
import axios from 'axios';
const Signup = ({ onSignupSuccess }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Assuming your backend expects fullName, email, and password for signup
            const response = await axios.post('https://chat-app-r44sb.ondigitalocean.app/signup', {
                email: formData.email,
                password: formData.password,
                // You might need to handle fullName separately depending on your backend
            });
            console.log('Signup success:', response.data);
            onSignupSuccess(); // Trigger the callback after successful signup
            navigate('/chat'); // Navigate to a protected route or home page after signup
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            // Optionally, show an error message to the user here
        }
    };

    // Function to handle Google Signup success
    const responseGoogle = (response) => {
        console.log(response);
        if (response.error) {
            console.error('Google signup failed:', response.error);
            return;
        }
        onSignupSuccess(); // Trigger the callback after successful Google signup
    };

    // Dummy function to simulate navigation to login page
    const handleSignInClick = () => {
        navigate('/login'); // Replace with your actual login route
    };

    return (
        <div className="max-w-sm mx-auto text-center p-6 shadow-lg rounded-lg mt-20">
            <h2 className="text-2xl font-semibold mb-6">Create Account</h2>
            <form onSubmit={handleFormSubmit}>
                <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={formData.fullName}
                    onChange={handleInputChange}
                />
                <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={formData.email}
                    onChange={handleInputChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-3 border border-gray-300 rounded mb-4"
                    value={formData.password}
                    onChange={handleInputChange}
                />
                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded mb-4 hover:bg-blue-600">
                    Sign Up
                </button>
            </form>
            <p className="text-sm mb-4">
                Already have an account?{' '}
                <button onClick={handleSignInClick} className="text-blue-500 hover:underline">
                    Sign in
                </button>
            </p>
            <div className="mb-4">OR</div>
            <GoogleLogin
                clientId="716287854139-h0253hbiffukv1uhdm71p28ol06s7050.apps.googleusercontent.com"
                buttonText="Sign Up with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <button
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                        className={`w-full text-white bg-red-500 hover:bg-red-600 
                 font-medium p-3 rounded transition ease-in-out 
                 duration-150 shadow-md focus:outline-none focus:ring-2 
                 focus:ring-offset-2 focus:ring-red-500`}
                    >
                        Sign Up with Google
                    </button>
                )}
            />

        </div>
    );
};

export default Signup;
