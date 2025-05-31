import random
from contextlib import asynccontextmanager

from fastapi import FastAPI
from pydantic import BaseModel

from backend.data_format import BarChart, LineChart, PieChart, Response

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
        return LoginResponse(user_id=random.randint(1, 0xFFFFFFFFFFFFFF))
    else:
        return user_id


@app.get("/proooompt")
async def proompt(proooompt: str, user_id: int) -> Response:
    return random.choice(
        [
            Response(
                index=42,
                title="pie",
                text="tools are slow",
                chart=PieChart(
                    chart_type="pie", series={"too little": 50.0, "too much": 50.0}
                ),
            ),
            Response(
                index=43,
                title="line",
                text="second",
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
                text="third",
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
