import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Book, BookCreateInput, BookStatus } from '../types/book';
import { createBook, deleteBook, fetchBooks, updateBook } from '../services/api';
import { BookForm } from '../components/BookForm';
import { BookCard } from '../components/BookCard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filterStatus, setFilterStatus] = useState<BookStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = async (statusFilter?: BookStatus) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks(statusFilter);
      setBooks(data);
    } catch (err: any) {
      setError('Could not connect to FastAPI backend. Make sure it is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks(filterStatus !== '' ? filterStatus : undefined);
  }, [filterStatus]);

  const handleAddBook = async (input: BookCreateInput) => {
    const newBook = await createBook(input);
    setBooks((prev) => [newBook, ...prev]);
  };

  const handleUpdateBook = async (id: number, status: BookStatus, rating?: number) => {
    const updated = await updateBook(id, { status, rating });
    setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) return;
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div style={containerStyle}>
      <Head>
        <title>Personal Book Tracker</title>
      </Head>

      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '4px' }}>📚 Personal Book Tracker</h1>
        <p style={{ color: '#666', margin: 0 }}>
          PostgreSQL + FastAPI + Next.js (React + TypeScript)
        </p>
      </header>

      {/* Add New Book Form */}
      <BookForm onSubmit={handleAddBook} />

      {/* Filter by Status Section */}
      <section style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>
          Filter by Status (PostgreSQL WHERE query):
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as BookStatus | '')}
          style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #999' }}
        >
          <option value="">All Books</option>
          <option value="want_to_read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </section>

      {/* Status & Messages */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Book List */}
      <section>
        <h2>
          Books List{' '}
          <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#666' }}>
            ({books.length} {books.length === 1 ? 'book' : 'books'})
          </span>
        </h2>

        {loading ? (
          <p>Loading books from database...</p>
        ) : books.length === 0 ? (
          <p style={{ color: '#888' }}>No books found for this filter. Try adding one above!</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px', maxWidth: '600px' }}>
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onUpdate={handleUpdateBook}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '32px 16px',
};

