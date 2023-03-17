import { type PaintingStructure, type Paintings } from "../../types";

export interface PaintingSupertestResponse extends PaintingStructure {
  id?: string;
  __v?: string;
}

export interface SupertestPaintingRequestResponse {
  body: {
    painting: PaintingStructure;
    paintings: Paintings;
  };
}
