export interface Review {
  id: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  reviewerId: number;
  reviewer?: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
}