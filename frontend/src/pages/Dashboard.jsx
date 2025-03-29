import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const sampleText = "The quick brown fox jumps over the lazy dog.";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/auth/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        } catch {
          localStorage.removeItem("token"); // Clear invalid token
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);
  const [isActive, setIsActive] = useState(false);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      calculateResults();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleChange = (e) => {
    if (!isActive) return;
    setInput(e.target.value);
    calculateErrors(e.target.value);
  };

  const calculateErrors = (value) => {
    let count = 0;
    value.split("").forEach((char, index) => {
      if (char !== sampleText[index]) count++;
    });
    setErrors(count);
  };

  const calculateResults = () => {
    const wordsTyped = input.trim().split(" ").length;
    setWpm((wordsTyped / (15 / 60)).toFixed(2));
  };

  const startTest = () => {
    setInput("");
    setTimeLeft(15);
    setIsActive(true);
    setErrors(0);
    setWpm(0);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-[400px] text-center">
        <h2 className="text-2xl font-semibold mb-4">
          {user ? `Welcome, ${user.username}` : "Welcome, Guest"}
        </h2>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Login
            </Link>
            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Register
            </Link>
          </div>
        )}
      </div>
      <div className="bg-white p-6 shadow-md rounded-lg w-[600px] text-center">
        <h2 className="text-xl font-bold mb-4">Typing Test</h2>
        <div className="border p-2 rounded-md text-left font-mono bg-gray-100">
          {sampleText.split(" ").map((word, wordIndex) => (
            <span key={wordIndex}>
              {word.split("").map((char, charIndex) => {
                let color = "text-gray-400"; // Default color
                if (input[wordIndex * (word.length + 1) + charIndex] === char) {
                  color = "text-black"; // Correct character
                } else if (input[wordIndex * (word.length + 1) + charIndex]) {
                  color = "text-red-500"; // Incorrect character
                }
                return (
                  <span key={charIndex} className={color}>
                    {char}
                  </span>
                );
              })} 
            </span>
          ))}
        </div>
        <textarea
          className="w-full p-2 mt-4 border rounded-md h-20"
          value={input}
          onChange={handleChange}
          disabled={!isActive}
        />
        <div className="flex justify-between mt-4">
          <p className="text-red-500">Errors: {errors}</p>
          <p className="text-blue-500">Time Left: {timeLeft}s</p>
          <p className="text-green-500">WPM: {wpm}</p>
        </div>
        <button
          onClick={startTest}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {isActive ? "Restart" : "Start Test"}
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
