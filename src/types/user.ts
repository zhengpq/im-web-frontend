export interface User {
  id: string;
  username: string;
  avatar: string;
  offline_time: number;
  created_at: number;
  updated_at: number;
}

export type UserOnlyData = Omit<User, 'created_at' | 'updated_at'>;
