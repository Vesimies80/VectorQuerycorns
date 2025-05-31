from random import randint
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from backend.data_format import PieChart, Response

from .database import engine, Base


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
        return LoginResponse(user_id=randint(1, 0xFFFFFFFFFFFFFF))
    else:
        return user_id


@app.get("/proooompt")
async def proompt(proooompt: str, user_id: int) -> Response:
    return Response(
        index=42,
        title="FOOBAR",
        text="tools are slow",
        chart=PieChart(chart_type="pie", shards={"too little": 50.0, "too much": 50.0}),
    )
