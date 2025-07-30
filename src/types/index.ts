export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  bio?: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: Date | any; // Firebase Timestamp
  likes: number;
  copies: number;
  isPublic: boolean;
  updatedAt?: Date | any; // Firebase Timestamp
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface UserLike {
  id: string;
  userId: string;
  promptId: string;
  createdAt: Date;
}

export interface UserCopy {
  id: string;
  userId: string;
  promptId: string;
  createdAt: Date;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}