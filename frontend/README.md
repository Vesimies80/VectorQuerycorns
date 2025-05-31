# VectorQuerycorns Frontend

Frontend: https://vectorquerycorns.org
Backend: https://vectorquerycorns.org/api/
Backend docs: https://vectorquerycorns.org/api/docs#/default

### Setup 

## Dev setup
    ```bash
    git clone https://github.com/Vesimies80/VectorQuerycorns.git
    cd frontend
    npm install
    npm run dev
    
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