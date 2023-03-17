import { Schema, model } from "mongoose";

export const PaintingSchema = new Schema({
  author: {
    type: String,
  },
  name: {
    type: String,
  },
  year: {
    type: String,
  },
  gallery: {
    type: String,
  },
  technique: {
    type: String,
  },
  size: {
    type: String,
  },
  medium: {
    type: String,
  },
  materials: {
    type: String,
  },
  unique: {
    type: String,
  },
  certificate: {
    type: String,
  },
  rarity: {
    type: String,
  },
  condition: {
    type: String,
  },
  signature: {
    type: String,
  },
  price: {
    type: String,
  },
  frame: {
    type: String,
  },
  highlightOrder: {
    type: String,
  },
  summary: {
    type: String,
  },
  image: {
    type: String,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
});

export const Painting = model("painting", PaintingSchema, "paintings");
