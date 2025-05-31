import random
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from backend.data_format import BarChart, LineChart, PieChart, Response

from .database import engine, Base

from .mcp_client import Chat

from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

server_params = StdioServerParameters(
    command="python",
    args=["backend/mcp_server.py"],
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(engine)
    yield


app = FastAPI(lifespan=lifespan)


class LoginResponse(BaseModel):
    user_id: int


@app.get("/login")
def login(user_id: int | None = None):
    if not user_id:
        return LoginResponse(user_id=random.randint(1, 0xFFFFFFFFFFFFFF))
    else:
        return user_id


@app.get("/proooompt")
async def proompt(proooompt: str, user_id: int) -> Response:
    chat = Chat()
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            output = await chat.process_query(session=session, query=proooompt)
            return Response.model_validate(
                {
                    "index": 42,
                    "title": "ai response",
                    "text": output[0].message,
                    "chart": {
                        "chart_type": output[0].chart_type,
                        "series": output[0].values,
                    },
                }
            )
