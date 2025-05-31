import random
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.data_format import Response

from .database import (
    MediaResponse,
    Proompt,
    ProomptSession,
    TextResponse,
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
    if not user_id:
        return LoginResponse(user_id=random.randint(1, 0xFFFFFFFFFFFFFF))
    else:
        return user_id


@app.get("/proooompt")
async def proompt(
    proooompt: str, user_id: int, db: Session = Depends(get_db)
) -> Response | str:
    chat = Chat()
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            output = await chat.process_query(session=session, query=proooompt)
            output = output[0]
            with db:
                if isinstance(output, str):
                    proompt_session = ProomptSession(
                        title="ai response",
                        user_id=user_id,
                        proomts=Proompt(
                            index=0,
                            question=proooompt,
                            text_responses=TextResponse(index=1, response=output),
                        ),
                    )
                else:
                    proompt_session = ProomptSession(
                        title="ai response",
                        user_id=user_id,
                        proomts=Proompt(
                            index=0,
                            question=proooompt,
                            media_response=MediaResponse(index=1, response=output),
                        ),
                    )
                db.add(proompt_session)
                db.commit()
            return output


@app.get("/previous/proooooooompts")
def previous(user_id: int, db: Session = Depends(get_db)):
    out = []
    for proompt in db.execute(
        select(ProomptSession).where(ProomptSession.user_id == user_id)
    ).scalars():
        if len(proompt.media_responses) != 0:
            out.append(proompt.media_responses[0].response)

    return out
