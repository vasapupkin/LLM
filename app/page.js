"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          max_tokens: 1024,
          temperature: 1,
          top_k: 40,
          top_p: 0.8,
          repetition_penalty: 1.005,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
    
      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || "Sorry, I couldn't generate a response." },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, there was an error processing your request.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format message content with markdown-like styling
  const formatMessage = (content) => {
    // Handle code blocks
    let formattedContent = content.replace(
      /```([\s\S]*?)```/g,
      '<div class="bg-gray-800 p-3 rounded-md my-2 overflow-x-auto font-mono text-sm">$1</div>'
    );

    // Handle inline code
    formattedContent = formattedContent.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-800 px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );

    // Handle headings
    formattedContent = formattedContent.replace(
      /^### (.*$)/gm,
      '<h3 class="text-lg font-bold mt-3 mb-1">$1</h3>'
    );
    formattedContent = formattedContent.replace(
      /^## (.*$)/gm,
      '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>'
    );
    formattedContent = formattedContent.replace(
      /^# (.*$)/gm,
      '<h1 class="text-2xl font-bold mt-5 mb-3">$1</h1>'
    );

    // Handle lists
    formattedContent = formattedContent.replace(
      /^\s*[\-\*]\s+(.*$)/gm,
      '<li class="ml-5 list-disc">$1</li>'
    );
    formattedContent = formattedContent.replace(
      /^\s*\d+\.\s+(.*$)/gm,
      '<li class="ml-5 list-decimal">$1</li>'
    );

    // Handle paragraphs and line breaks
    formattedContent = formattedContent.replace(/\n\n/g, "<br/><br/>");

    return formattedContent;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold text-center">AI Assistant</h1>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-auto p-4 md:px-8 max-w-3xl mx-auto w-full">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500 max-w-md">
              <h2 className="text-2xl font-semibold mb-4">How can I help you today?</h2>
              <p>
                Ask me anything and I'll do my best to assist you. I can provide information, generate content, or help with problem-solving.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    className="prose prose-invert max-w-none"
                  />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4">
        <form
          onSubmit={handleSubmit}
          className="flex space-x-2 max-w-3xl mx-auto"
        >
          <input
            type="text"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
