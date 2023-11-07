export interface AdminUserInterface {
  id: number;
  email: string | null;
  phone: string | null;
  password: string | null;
  accessToken: string;
  refreshToken: string;
}
