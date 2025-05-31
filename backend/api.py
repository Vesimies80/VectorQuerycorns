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
            print(output)
            #Cursed atm
            output = ''.join(output)
    return random.choice(
        [
            Response(
                index=42,
                title="pie",
                text=output,
                chart=PieChart(
                    chart_type="pie", series={"too little": 50.0, "too much": 50.0}
                ),
            ),
            Response(
                index=43,
                title="line",
                text=output,
                chart=LineChart(
                    chart_type="line",
                    series={
                        "serie1": [random.random() for _ in range(100)],
                        "seri22": [random.random() for _ in range(100)],
                    },
                ),
            ),
            Response(
                index=43,
                title="bar",
                text=output,
                chart=BarChart(
                    chart_type="bar",
                    series={
                        "legend1": random.random(),
                        "legend2": random.random(),
                        "legend3": random.random(),
                        "legend4": random.random(),
                        "legend5": random.random(),
                    },
                ),
            ),
        ]
    )
