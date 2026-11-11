from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from . import models, schemas

async def create_book(db: AsyncSession, book_in: schemas.BookCreate) -> models.Book:
    new_book = models.Book(
        title=book_in.title,
        author=book_in.author,
        status=book_in.status,
        rating=book_in.rating
    )
    db.add(new_book)
    await db.commit()
    await db.refresh(new_book)
    return new_book

async def get_book(db: AsyncSession, book_id: int) -> Optional[models.Book]:
    result = await db.execute(select(models.Book).where(models.Book.id == book_id))
    return result.scalar_one_or_none()

async def get_books(
    db: AsyncSession, 
    status: Optional[models.BookStatus] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[models.Book]:
    # Demonstrating WHERE filter and ORDER BY created_at
    stmt = select(models.Book).order_by(models.Book.created_at.desc())
    if status:
        stmt = stmt.where(models.Book.status == status)
    stmt = stmt.offset(skip).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()

async def update_book(
    db: AsyncSession, 
    book_id: int, 
    book_in: schemas.BookUpdate
) -> Optional[models.Book]:
    # Exclude unset fields so we only update what was provided
    update_data = book_in.model_dump(exclude_unset=True)
    if not update_data:
        return await get_book(db, book_id)

    stmt = (
        update(models.Book)
        .where(models.Book.id == book_id)
        .values(**update_data)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)
    await db.commit()
    return await get_book(db, book_id)

async def delete_book(db: AsyncSession, book_id: int) -> bool:
    stmt = delete(models.Book).where(models.Book.id == book_id)
    result = await db.execute(stmt)
    await db.commit()
    return result.rowcount > 0
