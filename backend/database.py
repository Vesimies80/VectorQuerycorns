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


engine = create_engine("sqlite:///.db/database.sqlite")

Session = sessionmaker(engine)


async def get_db():
    with Session() as session:
        try:
            yield session
        finally:
            session.commit()


class Base(DeclarativeBase):
    type_annotation_map = {dict[str, Any]: JSON}


class ProomptSession(Base):
    __tablename__ = "proompt_session"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int]
    proompts: Mapped[List[Proompt]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )
    text_responses: Mapped[List[TextResponse]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )
    media_responses: Mapped[List[MediaResponse]] = relationship(
        back_populates="session", cascade="all, delete-orphan"
    )
    title: Mapped[str]
    description: Mapped[str]


class Proompt(Base):
    __tablename__ = "proompt"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("proompt_session.id"))
    session: Mapped[ProomptSession] = relationship(back_populates="proompts")
    index: Mapped[int]
    question: Mapped[str]


class TextResponse(Base):
    __tablename__ = "text_response"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("proompt_session.id"))
    session: Mapped[ProomptSession] = relationship(back_populates="proompts")
    index: Mapped[int]
    response: Mapped[str]


class MediaResponse(Base):
    __tablename__ = "media_response"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("proompt_session.id"))
    session: Mapped[ProomptSession] = relationship(back_populates="proompts")
    index: Mapped[int]
    response_json: Mapped[dict[str, Any]]

    @hybrid_property
    def response(self):
        return Response.model_validate(self.response_json)

    @response.setter
    def response_set(self, value: Response):
        self.response_json = value.model_dump()
