import { type Request } from "express";
import { type JwtPayload } from "jsonwebtoken";

export interface CustomLoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserStructure extends UserCredentials {
  username: string;
}

export interface Painting {
  author: string;
  name: string;
  year: string;
  gallery: string;
  technique: string;
  size: string;
  medium: string;
  materials: string;
  unique: boolean;
  certificate: boolean;
  rarity: string;
  condition: string;
  signature: boolean;
  price: number;
  frame: boolean;
  highlightOrder: number;
  summary: string;
  image: string;
}

export type Paintings = Painting[];

export interface CustomMongoResponse {
  id: string;
}
export interface MongoInsertManyReturnedValue {
  object: CustomMongoResponse[];
}

export interface CustomRequest extends Request {
  id: string;
  username: string;
  body: Painting;
}

export interface CustomJwtPayload extends JwtPayload {
  username: string;
}
