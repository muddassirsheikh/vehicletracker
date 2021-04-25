export interface User {
  [propName: string]: any;

  id: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Token {
  access_token?: string;
  token?: string;
  token_type?: string;
  expires_in?: number;
}

export const admin: User = {
  id: 3,
  name: 'Admin',
  email: 'admin@gmail.com',
  avatar: './assets/images/avatar.jpg',
};

export const guest: User = {
  id: null,
  name: 'unknown',
  email: 'unknown',
  avatar: './assets/images/avatar-default.jpg',
};
