from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from langgraph.prebuilt import create_react_agent
from langchain_mcp_adapters.tools import load_mcp_tools
import asyncio

server_params = StdioServerParameters(
    command="python",
    args=["mcp_server.py"],
)
class Chat:
    def __init__(self):
        self.messages = []
        self.system_prompt: str = """You are a master SQLite assistant. 
        Your job is to use the tools at your dispoal to execute SQL queries and provide the results to the user."""
    async def process_query(self, session: ClientSession, query: str):
        tools = await load_mcp_tools(session)
        agent = create_react_agent("openai:gpt-4.1", tools)
        res = await agent.ainvoke({"messages":query})
        print(res)
                
    async def chat_loop(self, session: ClientSession):
        while True:
            query = input("\nQuery: ").strip()
            self.messages.append(query)
            await self.process_query(session, query)
            
    async def run(self):
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize the connection
                await session.initialize()

                await self.chat_loop(session)

chat = Chat()
asyncio.run(chat.run())