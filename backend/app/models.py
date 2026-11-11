from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class BookStatus(str, enum.Enum):
    want_to_read = "want_to_read"
    reading = "reading"
    finished = "finished"

class Book(Base):
    __tablename__ = "books"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=True)
    status = Column(Enum(BookStatus), nullable=False, default=BookStatus.want_to_read)
    rating = Column(Integer, nullable=True)  # 1-5
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

