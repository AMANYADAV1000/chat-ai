import logo from './logo.svg';
import './App.css';
import ChatContainer from './Chat';

function App() {
  return (
    <div className="w-full max-w-xl mx-auto md:w-1/2 md:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
      <div className="card bg-white p-6 shadow-lg rounded-lg h-[85vh]">
        <ChatContainer />
      </div>
    </div>
  );
}

export default App;
