import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
          import.meta.env.VITE_API_KEY
        }`,
        method: "POST",
        data: { contents: [{ parts: [{ text: question }] }] },
      });

      setAnswer(
        response?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No answer available."
      );
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error?.message || "An error occurred."
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

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text.trim());
    alert("Code copied to clipboard!");
  }

  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <header className="w-full py-4 shadow-lg flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">Chatbot AI</h1>
        <button
          className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center mt-8">
        <div
          className={`${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          } shadow-md rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2 flex flex-col`}
        >
          <textarea
            className={`border rounded-lg w-full p-3 mb-4 resize-none ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "border-gray-300 text-black"
            } focus:ring-2 focus:ring-blue-500`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="5"
          ></textarea>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

          <div className="flex justify-between">
            <button
              className={`px-4 py-2 text-white rounded-lg ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={generateAnswers}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Answer"}
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={clearChat}
            >
              Clear
            </button>
          </div>

          <div className="mt-6">
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Answer:
            </h3>
            <div
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-gray-100 text-black border-gray-300"
              }`}
            >
              <ReactMarkdown
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <div className="relative">
                        <button
                          onClick={() => copyToClipboard(children)}
                          className="absolute top-2 right-2 bg-gray-300 text-black px-2 py-1 text-sm rounded hover:bg-gray-400"
                        >
                          Copy
                        </button>
                        <SyntaxHighlighter
                          style={materialDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {answer || "Your answer will appear here."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-4 bg-gray-200 text-center shadow-lg mt-8">
        <p className="text-sm text-black">
          Made with ❤️ by{" "}
          <a
            href="https://github.com/Rahamatullamandal2005"
            className="text-blue-600"
          >
            Rahamatulla
          </a>
        </p>
        <p className="text-sm text-black">
          Powered by{" "}
          <a href="https://cloud.google.com/ai" className="text-blue-600">
            Google Generative AI
          </a>
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
