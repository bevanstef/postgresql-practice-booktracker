import React, { useState } from 'react';
import { Book, BookStatus } from '../types/book';

interface BookCardProps {
  book: Book;
  onUpdate: (id: number, status: BookStatus, rating?: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onUpdate, onDelete }) => {
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [rating, setRating] = useState<number | ''>(book.rating ?? '');
  const [saving, setSaving] = useState(false);

  const handleStatusChange = async (newStatus: BookStatus) => {
    setStatus(newStatus);
    setSaving(true);
    try {
      await onUpdate(book.id, newStatus, rating !== '' ? Number(rating) : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleRatingChange = async (newRating: number | '') => {
    setRating(newRating);
    setSaving(true);
    try {
      await onUpdate(book.id, status, newRating !== '' ? Number(newRating) : undefined);
    } finally {
      setSaving(false);
    }
  };

  const statusColors: Record<BookStatus, string> = {
    want_to_read: '#f59e0b',
    reading: '#3b82f6',
    finished: '#10b981',
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: '0 0 4px 0' }}>{book.title}</h4>
          <p style={{ margin: '0 0 8px 0', color: '#555' }}>
            by {book.author ? book.author : 'Unknown Author'}
          </p>
        </div>
        <button
          onClick={() => onDelete(book.id)}
          style={deleteButtonStyle}
          title="Delete book"
        >
          ✕ Delete
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
        <div>
          <label style={{ fontSize: '12px', display: 'block', color: '#666' }}>Status: </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
            disabled={saving}
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              border: `2px solid ${statusColors[status]}`,
              fontWeight: 500,
            }}
          >
            <option value="want_to_read">Want to Read</option>
            <option value="reading">Reading</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', display: 'block', color: '#666' }}>Rating: </label>
          <select
            value={rating}
            onChange={(e) => handleRatingChange(e.target.value === '' ? '' : Number(e.target.value))}
            disabled={saving}
            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Unrated</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐⭐</option>
            <option value="3">3 ⭐⭐⭐</option>
            <option value="4">4 ⭐⭐⭐⭐</option>
            <option value="5">5 ⭐⭐⭐⭐⭐</option>
          </select>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#888', marginTop: '10px' }}>
        Added on: {new Date(book.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  marginBottom: '12px',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '4px 8px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

