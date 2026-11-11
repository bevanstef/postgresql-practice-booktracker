from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas, crud, database

app = FastAPI(title="Personal Book Tracker API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Automatically creates PostgreSQL tables on startup if they don't exist
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Personal Book Tracker API! 📚",
        "docs": "Visit /docs for the interactive Swagger API documentation",
        "endpoints": {
            "list_books": "GET /books/",
            "create_book": "POST /books/",
            "get_book": "GET /books/{id}",
            "update_book": "PUT /books/{id}",
            "delete_book": "DELETE /books/{id}"
        }
    }

@app.post("/books/", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED)
async def create_book(book: schemas.BookCreate, db: AsyncSession = Depends(database.get_db)):
    """Create a new book in the reading list."""
    return await crud.create_book(db, book)

@app.get("/books/", response_model=List[schemas.BookResponse])
async def list_books(
    status: Optional[models.BookStatus] = Query(None, description="Filter by status (want_to_read, reading, finished)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: AsyncSession = Depends(database.get_db)
):
    """List books with optional status filtering and sorting by creation date."""
    return await crud.get_books(db, status=status, skip=skip, limit=limit)

@app.get("/books/{book_id}", response_model=schemas.BookResponse)
async def read_book(book_id: int, db: AsyncSession = Depends(database.get_db)):
    """Get a single book by ID."""
    book = await crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.put("/books/{book_id}", response_model=schemas.BookResponse)
async def update_book(
    book_id: int, 
    payload: schemas.BookUpdate, 
    db: AsyncSession = Depends(database.get_db)
):
    """Update a book's status, rating, or details."""
    updated = await crud.update_book(db, book_id, payload)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated

@app.delete("/books/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, db: AsyncSession = Depends(database.get_db)):
    """Delete a book from the tracker."""
    deleted = await crud.delete_book(db, book_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Book not found")
    return None
