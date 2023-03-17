import { type PaintingStructure } from "../../types";
import { type PaintingSupertestResponse } from "./types";

export const deleteDatabaseInsertedUnpredictableProperties = (
  painting: PaintingSupertestResponse
): PaintingStructure => {
  delete painting.id;
  delete painting.__v;

  return painting;
};
