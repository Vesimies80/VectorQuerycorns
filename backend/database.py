from __future__ import annotations
from typing import List, Any
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import JSON

from .data_format import Response


engine = create_engine("sqlite:///db/database.sqlite")

Session = sessionmaker(engine)


async def get_db():
    with Session() as session:
        try:
            yield session
        finally:
            session.commit()


class Base(DeclarativeBase):
    type_annotation_map = {dict[str, Any]: JSON}


class Proompt(Base):
    __tablename__ = "proompt"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int]
    title: Mapped[str]
    question: Mapped[str]
    response_text: Mapped[str]
    response_json: Mapped[dict[str, Any] | None]

    @hybrid_property
    def response(self):
        if self.response_json is None:
            return None
        return Response.model_validate(self.response_json)

    @response.setter
    def response_set(self, value: Response):
        self.response_json = value.model_dump()

    def __repr__(self) -> str:
        return f"Proompt(id={self.id}, user_id={self.user_id}, title={self.title}, question={self.question}, response_text={self.response_text}, response_json={self.response_json})"
