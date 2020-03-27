export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export type Profile = Omit<User, "token" | "email"> & { following: boolean };

export interface UserResponse {
  user: User;
}

export interface ProfileResponse {
  profile: Profile;
}
