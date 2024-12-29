import { useState } from "react";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState(""); // Question input state
  const [answer, setAnswer] = useState(""); // Answer display state
  const [loading, setLoading] = useState(false); // Loading indicator state
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  async function generateAnswers() {
    if (!question.trim()) {
      setErrorMessage("Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setErrorMessage("");

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_API_KEY}`,
        method: "POST",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });
      setAnswer(
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No answer available."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error?.message ||
        "An error occurred while generating the answer. Please try again."
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setQuestion("");
    setAnswer("");
    setErrorMessage("");
  }

  return (
    <div
      className={`flex flex-col justify-between min-h-screen ${darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
    >
      {/* Header */}
      <header className="w-full py-4 shadow-lg flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Chatbot AI</h1>
        <button
          className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Chat Container */}
      <main className="flex-grow flex flex-col items-center mt-8 sm:mt-4">
        <div className="bg-white shadow-md rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 flex flex-col">
          <textarea
            className="border border-gray-300 rounded-lg w-full p-3 mb-4 text-black resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="5"
          ></textarea>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="flex justify-between">
            <button
              className={`px-4 py-2 text-white rounded-lg ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
              onClick={generateAnswers}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <span className="loader"></span> Generating...
                </div>
              ) : (
                "Generate Answer"
              )}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={clearChat}
            >
              Clear
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-black">Answer:</h3>
            <p
              className="bg-gray-100 p-4 rounded-lg border border-gray-300 text-black"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {answer || "Your answer will appear here."}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-200 text-center shadow-lg sm:mt-4 mt-8">
        <p className="text-sm text-black">
          Made with ❤️ by <a href="https://github.com" className="text-blue-600">YourName</a>
        </p>
        <p className="text-sm text-black">
          Powered by <a href="https://cloud.google.com/ai" className="text-blue-600">Google Generative AI</a>
        </p>
      </footer>
    </div>

  );
}

export default App;


// return (
//   <>
//     <h1 className="bg-blue-300">
//       Chatbot AI
//     </h1>
//     <textarea
//       className='border rounded w-full'
//       value={question}
//       onChange={(e) => setQuestion(e.target.value)}
//       cols="30"
//       rows="10"
//       placeholder='Ask anything to me'
//     >
//     </textarea><br />
//     <button onClick={generateAnswers}>Generate Answer</button>
//     <pre>{answer}</pre>
//   </>
// )
