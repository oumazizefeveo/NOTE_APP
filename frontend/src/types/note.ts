export type Category = 'travail' | 'personnel' | 'urgent';

export interface Attachment {
  _id?: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface Note {
  _id: string;
  title: string;
  content?: string;
  category: Category;
  tags: string[];
  attachments: Attachment[];
  color?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content?: string;
  category?: Category;
  tags?: string[];
  color?: string;
  archived?: boolean;
}
