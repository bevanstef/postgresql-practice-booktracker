from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from .models import BookStatus

class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255, description="Title of the book")
    author: Optional[str] = Field(None, max_length=255, description="Author of the book")
    status: BookStatus = Field(default=BookStatus.want_to_read, description="Current reading status")
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1 to 5")

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    author: Optional[str] = None
    status: Optional[BookStatus] = None
    rating: Optional[int] = Field(None, ge=1, le=5)

class BookResponse(BookBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

