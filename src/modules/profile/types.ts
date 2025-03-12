export interface UserProfile {
  id: string;
  userId: string;
  bio: string;
  location?: string;
  website?: string;
  interests: string[];
  favoriteScents: string[];
  level: number;
  xp: number;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}
