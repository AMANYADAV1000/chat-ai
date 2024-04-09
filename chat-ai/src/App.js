// import logo from './logo.svg';
// import './App.css';
// import coolAIBackground from './images/cool_ai_bg.png';
// import ChatContainer from './Components/Chat';

// function App() {
//   return (

//     <main
//       className="flex flex-col items-center justify-center w-full min-h-screen p-4 gap-4 md:flex-row md:p-8"
//       style={{
//         backgroundImage: `url(${coolAIBackground})`,
//         //backgroundColor: 'gray',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="w-full max-w-xl mx-auto md:w-1/2 md:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
//         <div className="card bg-white p-6 shadow-lg rounded-lg h-[85vh]">
//           <ChatContainer />
//         </div>
//       </div>
//     </main>
//   );
// }

// export default App;
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup'; // Import the Signup component
import HomePage from './Components/Homepage'; // Import the HomePage component
import './App.css';
import ChatPageLayout from './Components/ChatPage';

function App() {
  const [user, setUser] = useState(null);

  const onLoginSuccess = (response) => {
    console.log(response);
    setUser(response.profileObj); // Here, you'd typically store the user in your state management
  };

  // Placeholder function for sign-up success
  const onSignupSuccess = () => {
    // Handle signup success, e.g., storing new user data, redirecting, etc.
    console.log('Signup successful');
    setUser({ name: "New User", id: "user123" }); 
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate replace to="/chat" /> : <Login onLoginSuccess={onLoginSuccess} />
        } />
        <Route path="/signup" element={
          user ? <Navigate replace to="/chat" /> : <Signup onSignupSuccess={onSignupSuccess} />
        } />
        <Route path="/" element={<HomePage />} /> {/* HomePage shown to everyone */}
        {/* <Route path="/chat" element={
          user ? (
            <ChatContainer /> // Show ChatContainer if user is authenticated
          ) : (
            <Navigate replace to="/login" /> // Redirect to /login if user is not authenticated
          )
        } /> */}
        <Route path="/chat" element={<ChatPageLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
