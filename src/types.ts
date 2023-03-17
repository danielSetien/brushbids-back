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

export interface PaintingStructure {
  author: string;
  name: string;
  year: string;
  gallery: string;
  technique: string;
  size: string;
  medium: string;
  materials: string;
  unique: string;
  certificate: string;
  rarity: string;
  condition: string;
  signature: string;
  price: string;
  frame: string;
  highlightOrder: string;
  summary: string;
  image: string;
}

export type Paintings = PaintingStructure[];

export interface CustomMongoResponse {
  id: string;
}
export interface MongoInsertManyReturnedValue {
  object: CustomMongoResponse[];
}

export interface CustomRequest extends Request {
  id: string;
  username: string;
  body: PaintingStructure;
}

export interface CustomJwtPayload extends JwtPayload {
  username: string;
}
