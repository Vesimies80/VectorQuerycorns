import random
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
import json

from backend.data_format import Response, OnlyTextResponse

from .database import (
    Proompt,
    engine,
    Base,
    get_db,
)

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
    """Endpoint to create a user id for user.

    In future this endpoint should have e.g. github OAuth for
    user verification but for now, we just have random user ids.
    """
    if not user_id:
        return LoginResponse(user_id=random.randint(1, 0xFFFFFFFFFFFFFF))
    else:
        return user_id


# Function to connect client to server
@app.get("/proooompt")
async def proompt(
    proooompt: str, user_id: int, db: Session = Depends(get_db)
) -> Response | OnlyTextResponse:
    """Create a new prompt for northwind dataset.

    This request might take a long time to succeed due to being done synchronously.
    """
    chat = Chat()
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            output = await chat.process_query(session=session, query=proooompt)
            output = output[0]
            with db:
                if isinstance(output, OnlyTextResponse):
                    prompt = Proompt(
                        user_id=user_id,
                        title=output.title,
                        question=proooompt,
                        response_text=output.text,
                    )
                else:
                    prompt = Proompt(
                        user_id=user_id,
                        title=output.title,
                        question=proooompt,
                        response_text=output.text,
                        response_json=output.chart.model_dump(),
                    )
                db.add(prompt)
                db.commit()
                db.refresh(prompt)
                output.index = prompt.id
            return output


@app.get("/previous/proooooooompts")
def previous(
    user_id: int, db: Session = Depends(get_db)
) -> list[Response | OnlyTextResponse]:
    """Query for users previous prompts and their responses."""
    out = []
    for proompt in db.execute(
        select(Proompt).where(Proompt.user_id == user_id)
    ).scalars():
        print(proompt)
        if proompt.response_json:
            out.append(
                Response(
                    index=proompt.id,
                    title=proompt.title,
                    text=proompt.response_text,
                    chart=proompt.response_json,
                    prompt=proompt.question,
                )
            )
        else:
            out.append(
                OnlyTextResponse(
                    index=proompt.id,
                    title=proompt.title,
                    text=proompt.response_text,
                    prompt=proompt.question,
                )
            )

    return out
