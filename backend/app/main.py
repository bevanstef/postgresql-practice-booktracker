# Backend FastAPI entry point

from fastapi import FastAPI, Depends, HTTPException
from typing import List, Optional
from . import models, crud, database

app = FastAPI(title="Book Tracker API")

@app.on_event("startup")
async def startup():
    # Create tables if they don't exist
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

@app.post("/books/", response_model=models.Book)
async def create_book(book: models.Book, db: database.AsyncSession = Depends(database.get_db)):
    return await crud.create_book(db, title=book.title, author=book.author,
                                 status=book.status, rating=book.rating)

@app.get("/books/", response_model=List[models.Book])
async def list_books(status: Optional[models.BookStatus] = None,
                     skip: int = 0, limit: int = 100,
                     db: database.AsyncSession = Depends(database.get_db)):
    return await crud.get_books(db, skip=skip, limit=limit, status=status)

@app.get("/books/{book_id}", response_model=models.Book)
async def read_book(book_id: int, db: database.AsyncSession = Depends(database.get_db)):
    book = await crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.put("/books/{book_id}", response_model=models.Book)
async def update_book(book_id: int, payload: models.Book, db: database.AsyncSession = Depends(database.get_db)):
    return await crud.update_book(db, book_id,
                                  title=payload.title,
                                  author=payload.author,
                                  status=payload.status,
                                  rating=payload.rating)

@app.delete("/books/{book_id}")
async def delete_book(book_id: int, db: database.AsyncSession = Depends(database.get_db)):
    await crud.delete_book(db, book_id)
    return {"ok": True}

