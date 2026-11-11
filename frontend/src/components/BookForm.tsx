import React, { useState } from 'react';
import { BookCreateInput, BookStatus } from '../types/book';

interface BookFormProps {
  onSubmit: (data: BookCreateInput) => Promise<void>;
}

export const BookForm: React.FC<BookFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<BookStatus>('want_to_read');
  const [rating, setRating] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        author: author.trim() || undefined,
        status,
        rating: rating !== '' ? Number(rating) : undefined,
      });
      // Reset form
      setTitle('');
      setAuthor('');
      setStatus('want_to_read');
      setRating('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add a New Book</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={fieldStyle}>
        <label>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Clean Code"
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Robert C. Martin"
          style={inputStyle}
        />
      </div>

      <div style={fieldStyle}>
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookStatus)}
          style={inputStyle}
        >
          <option value="want_to_read">Want to Read</option>
          <option value="reading">Reading</option>
          <option value="finished">Finished</option>
        </select>
      </div>

      <div style={fieldStyle}>
        <label>Rating (1-5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
          style={inputStyle}
        >
          <option value="">No rating yet</option>
          <option value="1">1 ⭐</option>
          <option value="2">2 ⭐⭐</option>
          <option value="3">3 ⭐⭐⭐</option>
          <option value="4">4 ⭐⭐⭐⭐</option>
          <option value="5">5 ⭐⭐⭐⭐⭐</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting} style={buttonStyle}>
        {isSubmitting ? 'Adding...' : 'Add Book'}
      </button>
    </form>
  );
};

const formStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
  maxWidth: '450px',
  backgroundColor: '#fafafa',
};

const fieldStyle: React.CSSProperties = {
  marginBottom: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const inputStyle: React.CSSProperties = {
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #aaa',
};

const buttonStyle: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: '#0070f3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

