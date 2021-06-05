export interface IAuthProviderSignInProps {
  email?: string;
  password?: string;
}

export interface IAuthProviderUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface IAuthProviderSession {
  startDate?: number;
  expireDate?: number;
  token?: string;
  authorized?: boolean;
}
