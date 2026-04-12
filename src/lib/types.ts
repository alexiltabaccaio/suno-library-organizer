export interface Song {
  id: string;
  title: string;
  styles: string;
  lyrics: string;
  duration: string;
  version: string;
  createdAt: Date;
  coverColor: string;
  notes?: string;
  isRenamed?: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPinned?: boolean;
}
