type Role = "driver" | "admin";

export type DBUserWithPassword = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  password: string | null;
  picture: string | null;
};

export type DBUser = Omit<DBUserWithPassword, "password">;
