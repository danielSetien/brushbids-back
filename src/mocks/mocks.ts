import { type NextFunction, type Request, type Response } from "express";
import { type Paintings } from "../types";

export const mockRequest: Request = {} as Request;

export const mockNext: NextFunction = jest.fn();

export const mockResponse: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

export const mockPaintings: Paintings = [
  {
    author: "Mary Heilmann",
    name: "New Line Up",
    year: "2018",
    gallery: "Private collection",
    technique: "Oil on canvas",
    size: "40 x 50 in",
    medium: "Painting",
    materials: "Oil paint, canvas",
    unique: "true",
    certificate: "true",
    rarity: "unique",
    condition: "excellent",
    signature: "true",
    price: "28000",
    frame: "false",
    highlightOrder: "1",
    summary:
      "Colorful abstract painting with horizontal lines and curved shapes",
    image:
      "https://icqwpkxwddqofeibjqcj.supabase.co/storage/v1/object/public/paitings/paintingImage-random.jpg",
    height: "200",
    width: "200",
  },
  {
    author: "Charles Ray",
    name: "Untitled",
    year: "1991",
    gallery: "Museum of Modern Art, New York",
    technique: "Mixed media",
    size: "Dimensions variable",
    medium: "Oil on canvas",
    materials: "Oil paint, canvas",
    unique: "true",
    certificate: "true",
    rarity: "unique",
    condition: "excellet",
    signature: "true",
    price: "3000",
    frame: "false",
    highlightOrder: "2",
    summary: "Floral mural",
    image:
      "https://icqwpkxwddqofeibjqcj.supabase.co/storage/v1/object/public/paitings/charlesRayUntilted.png?t=2023-03-11T16%3A11%3A40.075Z",
    height: "200",
    width: "200",
  },
];
