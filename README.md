# VectorQuerycorns 🦄
AI agent that can do complicated queries to answer the users question

Link to our google slides where we have some basic info about this project and interesting queries if you missed them in our project description!
[Link to google slides](https://docs.google.com/presentation/d/1lmrZfQ6yIltcm_q985mqo_saP6y-wPMPbO4fbmJZro4/edit?usp=sharing>)



# VectorQuerycorns Frontend 🦄

Frontend: https://vectorquerycorns.org  
Backend: https://vectorquerycorns.org/api/  
Backend docs: https://vectorquerycorns.org/api/docs#/default  

### Development Setup 

    git clone https://github.com/Vesimies80/VectorQuerycorns.git
    cd frontend
    npm install
    npm run dev
    Open url: http://localhost:3000

### TL;DR
The VectorQuerycorns frontend is a Next.js (v15) + Tailwind CSS chat‐style interface that connects to a FastAPI/OpenAI backend. On load, it retrieves a persistent userId (via /api/login) and fetches that user’s past prompts/responses (via /api/previous/proooooooompts), then displays them as right‐aligned prompt bubbles and left‐aligned response bubbles (responses may include charts rendered with D3). Users type or press Enter to send new prompts—the UI immediately shows a “loading” GIF until the backend reply arrives. Responses include a title, collapsible text, and an optional bar/pie/line chart (with dynamic, non‐overlapping legends for pie/line). Dark/light mode can be toggled (and is persisted in localStorage), and /api/* requests are automatically proxied to the FastAPI server via next.config.js.
    
### TL;DR of Each File
	•	layout.js: Sets page metadata, unicorn favicon, fonts, base Tailwind styles, and root structure.
	•	page.js: Coordinates state (dark mode, userId, conversations), fetches history, and renders chat interface.
	•	Header.js: Manages user authentication (via /api/login) and dark/light toggle UI.
	•	ChatInput.js: Controlled input for prompts; sends on Enter or button click.
	•	PromptBubble.jsx: Right‐aligned bubble styling for user prompts.
	•	ResponseBubble.jsx: Left‐aligned bubble for responses with “Collapse/Expand” and always‐black text.
	•	LoadingBubble.jsx: Shows a 300×300 loading.gif while waiting for a response.
	•	ChartVisualization.js: Renders D3 bar/pie/line charts with dynamic legends (except bar charts omit legend).
	•	MessageBubble.jsx: Generic bubble combining text + optional chart (light use).
	•	auth.js: Handles retrieving or creating a persistent userId via /api/login.
	•	api.js: Exposes queryBackend(...) and fetchPreviousPrompts(...) for all API calls.