export interface ProductMutation {
  category: string;
  title: string;
  description: string;
  price: number;
  image: string | null;
}

export interface IUser {
  username: string;
  password: string;
  token: string;
}