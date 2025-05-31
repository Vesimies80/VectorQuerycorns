# VectorQuerycorns Backend 🦄

A FastAPI + MCP (Model Context Protocol) server that processes user prompts, interacts with a PostgreSQL (Northwind) database, invokes OpenAI agents via MCP, and stores/fetches conversation history.


🚀 Full Deployment

## Prerequisites

Docker  
- Docker & Docker Compose. Install from Docker’s official site.  

OpenAI API Token  
- In the backend/ folder, create a file named .env.  
- Add your OpenAI API key to this file:  
- OPENAI_API_KEY=<your_openai_api_key>


Initialize Dataset Submodule
```
git submodule update --init
```


## Start All Services  
- Open a terminal and navigate to the project root (where docker-compose.yml resides).  
- Run:  
```
docker compose up
```
- After a few moments, both the backend (FastAPI + MCP server) and the frontend (Next.js) will be up and running.  
- Open your browser and navigate to http://127.0.0.1:80 to access the UI.  


## Environment Variables
- The Docker setup automatically mounts the .env file for the OpenAI API key.
- Local Development (without Docker). If you prefer running the backend locally, export the environment variable in your shell:
```
export OPENAI_API_KEY=<your_openai_api_key>
```


🛠️ Development Setup (Backend Only)
- Navigate to the backend directory:
```
cd backend
```
- Install dependencies:
```
pip install -r requirements.txt
```
- Ensure PostgreSQL (Northwind database) is running and accessible.
- Example using Docker CLI to start a PostgreSQL container:
```
docker run -d \
  --name northwind \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:13
```
- Start the FastAPI server (defaults to port 8000):
```
uvicorn backend.api:app --reload
```
- In a separate terminal, start the MCP server:
```
python -m backend.mcp_server
```




## 📝 TL;DR (Overall Architecture)

The VectorQuerycorns backend is a FastAPI application that:  
- Persists user prompts and their corresponding responses in SQLite (via SQLAlchemy).  
- Runs an MCP server (using mcp.server.fastmcp) to query the PostgreSQL Northwind dataset and interface with an OpenAI agent.  
- Exposes two main endpoints:  
	- GET /proooompt  
		- Receives a proooompt (user query) and user_id.  
		- Opens an MCP client session (using a stdio_client pointing to mcp_server.py).  
		- Calls chat.process_query(...) to obtain a list of Response or OnlyTextResponse objects.  
		- Persists the first output into the SQLite database (Proompt table).  
		- Returns the processed response as JSON.  
	- GET /previous/proooooooompts  
		- Queries the SQLite database for all Proompt rows associated with a given user_id.  
		- Returns a list of these records, formatted as Pydantic models.  
- When a client sends a request to /proooompt, FastAPI initiates an MCP client session. The MCP server can execute SQL commands or list database tables, then returns a JSON response containing:  
	- index
	- title
	- text
	- Optional chart data (PieChart, LineChart, or BarChart)
- User conversation history is stored in SQLite and can be retrieved via /previous/proooooooompts.

## 📂 TL;DR (File Breakdown)  

Below is a concise description of the files and their responsibilities in the backend/ folder:  

- __init__.py / __main__.py  
	- These files are empty.
	- They mark the backend/ folder as a Python package.
	- No specific logic is implemented within them.

- api.py
Contains the main FastAPI application with the following endpoints:
  	- GET /login
		- Returns a randomly generated user_id (UUID).
		- If user_id is provided in the request, echoes it back unchanged.
	- GET /proooompt
		- Receives a proooompt (user query) and a user_id as query parameters.
		- Instantiates a Chat() object.
		- Opens an MCP client session (using stdio_client to connect with mcp_server.py).
		- Calls chat.process_query(...) to obtain a list of Response or OnlyTextResponse objects.
		- Persists the first response into the SQLite database (Proompt table).
		- Returns the processed response JSON to the client.
	- GET /previous/proooooooompts
		- Queries the SQLite database for all Proompt records associated with a given user_id.
		- Returns a list of these records, each formatted as a Pydantic model.
- data_format.py
Defines Pydantic schemas for data validation and serialization:
	- PieChart, LineChart, BarChart
	- Define the structure for different chart types.
	- Each includes a series mapping to represent chart data.
	- Response
		- Fields:
			- index (int)
			- title (str)
			- text (str)
			- chart (optional union of chart types)
			- prompt (str)
	- OnlyTextResponse
		- Fields:
			- index (int)
			- title (str)
			- text (str)
			- prompt (str)
- database.py
Handles SQLAlchemy configuration for the SQLite database (backend/db/database.sqlite) and defines the Proompt ORM model:
- Proompt ORM Model
	- Columns:
	  	- id (Primary Key, Integer)
	  	- user_id (String / UUID)
		- title (String)
		- question (String)
		- response_text (Text)
		- response_json (Text: serialized Pydantic response)
	- Hybrid Property
	- response
	- Deserializes the response_json (stored as a string) into a Pydantic Response object on access.
	- get_db() Dependency
	- Yields a database session.
	- Ensures the session is committed and closed upon exit (using try/except/finally).
- mcp_client.py
Defines Pydantic models and the Chat class for interacting with the MCP server:
	- Pydantic Models
		- ModelOutput
		- TextOutput
		- Used to parse JSON responses from the MCP server.
	- Chat Class
		- Maintains:
			- self.messages: a list of conversation messages (history).
			- self.system_prompt: instructions guiding the AI agent on output format.
			- process_query(session, query)
	- Sends the user’s message to a ReAct agent via MCP.
	- Receives JSON-formatted responses.
	- Parses each JSON into a Response or OnlyTextResponse model.
	- Returns a list of parsed response objects.
		- run()
		- Opens a stdio_client(server_params) to connect to the MCP server.
		- Initializes the MCP connection.
		- Enters a loop for interactive querying (useful for manual testing via CLI).
- mcp_server.py
	- Implements the MCP server that interacts with the Northwind PostgreSQL database:
		- Instantiate MCP
	- PostgreSQL Database Context Manager
	- Uses psycopg2 to connect to the Northwind database and yield a cursor/connection.
		- MCP Resources & Tools:
		- @mcp.resource("config://northwind/schema")
			- Returns metadata about all tables and columns in the Northwind database (for schema inspection).
			- @mcp.tool() query_data(sql: str)
			- Executes an arbitrary SQL query against the Northwind database.
			- Returns query results (rows) or an error message if the SQL fails.
		- @mcp.tool() list_resources()
			- Retrieves a list of Resource objects, each representing a table in the database (including its schema).
		- @mcp.prompt() example_prompt(code: str)
			- A utility prompt template (e.g., for code review).
			- Can be expanded/customized for other templating use cases.
