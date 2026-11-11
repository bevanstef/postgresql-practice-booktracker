import { Book, BookCreateInput, BookStatus, BookUpdateInput } from '../types/book';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchBooks(status?: BookStatus): Promise<Book[]> {
  const url = status ? `${API_BASE_URL}/books/?status=${status}` : `${API_BASE_URL}/books/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function fetchBook(id: number): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch book #${id}`);
  return res.json();
}

export async function createBook(book: BookCreateInput): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Failed to create book');
  return res.json();
}

export async function updateBook(id: number, book: BookUpdateInput): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(`Failed to update book #${id}`);
  return res.json();
}

export async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete book #${id}`);
}

