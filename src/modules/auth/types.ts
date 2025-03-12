export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  membershipType: "free" | "business";
  avatarUrl?: string;
  createdAt: string;
}
