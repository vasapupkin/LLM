You have two options to customize your client:

1. Use the full code from this repository as-is.

2. Use the prompt provided below to generate your own code via Cursor.ai.



In both cases, make sure to replace the API route URL with a link to your own server:

* If you’re using the code from this repo, update the server link in the API route.

* If you’re using Cursor.ai, update the link directly within the prompt.



This step is essential for the client to work correctly with your own backend.


## Prompt

The application should be a single-page OnePager app styled to resemble ChatGPT. It should have:
	•	A centered chat window with a text input field at the bottom.
	•	A send button (arrow icon) to submit user input.
	•	Messages should be displayed in a scrollable chat container.
	•	The app should send user input to a backend(@https://db259cfcd72e845a3bc5a510077dd53a9.clg07azjl.paperspacegradient.com/generate/) with({
  "prompt": "input message",
  "max_tokens": 1024,
  "temperature": 1,
  "top_k": 40,
  "top_p": 0.8,
  "repetition_penalty": 1.005
}) via fetch API, wait for the response, and then display it in the chat window.
       • create a proxy endpoint in our Next.js application to handle the API requests api/generate/route.js to avoid CORS issues.
       • format the AI's response text to display nicely in the chat window, especially for structured content that includes headings, code blocks, and lists.

Don't change any configuration files use the configuration you have, so change/create only route.js and page.js 

Ensure the UI is well-designed using Tailwind CSS in dark mode and follows a clean and modern look. The code should be structured professionally as if written by a Senior Software Engineer.

