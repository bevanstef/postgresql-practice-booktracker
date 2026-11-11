export type BookStatus = 'want_to_read' | 'reading' | 'finished';

export interface Book {
  id: number;
  title: string;
  author: string | null;
  status: BookStatus;
  rating: number | null;
  created_at: string;
}

export interface BookCreateInput {
  title: string;
  author?: string;
  status?: BookStatus;
  rating?: number;
}

export interface BookUpdateInput {
  title?: string;
  author?: string;
  status?: BookStatus;
  rating?: number;
}

