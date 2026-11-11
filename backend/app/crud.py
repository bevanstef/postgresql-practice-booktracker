from typing import List, Optional
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from . import models

async def create_book(db: AsyncSession, title: str, author: Optional[str] = None,
                     status: models.BookStatus = models.BookStatus.want_to_read,
                     rating: Optional[int] = None):
    new_book = models.Book(title=title, author=author, status=status, rating=rating)
    db.add(new_book)
    await db.commit()
    await db.refresh(new_book)
    return new_book

async def get_book(db: AsyncSession, book_id: int):
    result = await db.execute(select(models.Book).where(models.Book.id == book_id))
    return result.scalar_one_or_none()

async def get_books(db: AsyncSession, skip: int = 0, limit: int = 100,
                    status: Optional[models.BookStatus] = None) -> List[models.Book]:
    stmt = select(models.Book).offset(skip).limit(limit).order_by(models.Book.created_at.desc())
    if status:
        stmt = stmt.where(models.Book.status == status)
    result = await db.execute(stmt)
    return result.scalars().all()

async def update_book(db: AsyncSession, book_id: int, **kwargs):
    stmt = (
        update(models.Book)
        .where(models.Book.id == book_id)
        .values(**kwargs)
        .execution_options(synchronize_session="fetch")
    )
    await db.execute(stmt)
    await db.commit()
    return await get_book(db, book_id)

async def delete_book(db: AsyncSession, book_id: int):
    stmt = delete(models.Book).where(models.Book.id == book_id)
    await db.execute(stmt)
    await db.commit()
    return True

