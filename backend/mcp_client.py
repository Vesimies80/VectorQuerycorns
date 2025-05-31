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
        self.system_prompt: str = """You are a master postgre assistant. 
        Your job is to use the tools and resources at your dispoal to 
        execute queries and find general information on the database and then provide the results to the user. You must always follow the following rules
        1. If the result contains more than 2 results then select a fitting diagram out of pie, bar and out put the response in the following format {"message": <Your answer>, "chart_type": <diagram type>, "values": <dict[str, float]>}
        2. Keep the answer under 30000 tokens and inform the user if the answer would be longer"""
        
    async def process_query(self, session: ClientSession, query: str):
        
        self.messages.append({"type": "human", "content": query})
        
        tools = await load_mcp_tools(session)
        agent = create_react_agent(model="openai:gpt-4.1", tools=tools,prompt=self.system_prompt)
        res = await agent.ainvoke({"messages":self.messages})

        outputmsg = []

        for key in res.keys():
            for msg in res[key]:
                if msg.type == "ai" and msg.content != "":
                    print("AI response\n",msg.content)
                    outputmsg.append(msg.content)
                #elif msg.type == "tool":
                #    print("Used tool\n", msg.name)
                elif msg.type == "human":
                    print("Human prompt\n",msg.content)
        return outputmsg
    async def chat_loop(self, session: ClientSession):
        while True:
            query = input("\nQuery: ").strip()
            #self.messages.append(query)
            await self.process_query(session, query)
            
    async def run(self):
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                # Initialize the connection
                await session.initialize()

                await self.chat_loop(session)


if __name__ == "__main__":
    chat = Chat()
    asyncio.run(chat.run())