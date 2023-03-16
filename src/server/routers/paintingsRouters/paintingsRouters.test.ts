import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDatabase from "../../../database/connectDatabase";
import { app } from "../..";
import { Painting } from "../../../database/models/PaintingSchema";
import { mockPaintings } from "../../../mocks/mocks";
import { deleteDatabaseInsertedUnpredictableProperties } from "../../../utils/testUtils";
import { type MongoInsertManyReturnedValue } from "../../../types";
import { type SupertestPaintingRequestResponse } from "../../../utils/testUtils/types";
import responses from "../../../utils/responses";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

describe("Given a GET paintings/ endpoint", () => {
  const getPaintingsEndpoint = "/paintings/";

  describe("When it receives a request to get a list of 2 paintings", () => {
    beforeAll(async () => {
      await Painting.insertMany(mockPaintings);
    });

    test("Then it should respond with a list of 2 paintings", async () => {
      const expectedPaintingsResponse = mockPaintings;

      const response: SupertestPaintingRequestResponse = await request(app).get(
        getPaintingsEndpoint
      );

      const predictablePaintingsResponse = response.body.paintings.map(
        (paintingResponse) =>
          deleteDatabaseInsertedUnpredictableProperties(paintingResponse)
      );

      expect(predictablePaintingsResponse).toStrictEqual(
        expectedPaintingsResponse
      );
    });

    test("Then it should respond with a status 200 response", async () => {
      const expectedStatusResponse = responses.statusCode.success;

      await request(app)
        .get(getPaintingsEndpoint)
        .expect(expectedStatusResponse);
    });
  });

  describe("When it receives a request to get a painting with a given id", () => {
    const mongoReturnedDocument = {
      object: "" as unknown,
    };

    beforeEach(async () => {
      mongoReturnedDocument.object = await Painting.insertMany(
        mockPaintings[0]
      );
    });

    test("Then it should respond with that particular painting", async () => {
      const expectedPaintingsResponse = mockPaintings[0];

      const paintingId = (mongoReturnedDocument as MongoInsertManyReturnedValue)
        .object[0].id;

      const getPaintingByIdFullRoute = `${getPaintingsEndpoint}${paintingId}`;

      const response: SupertestPaintingRequestResponse = await request(app).get(
        getPaintingByIdFullRoute
      );

      const predictablePaintingResponse =
        deleteDatabaseInsertedUnpredictableProperties(response.body.painting);

      expect(predictablePaintingResponse).toStrictEqual(
        expectedPaintingsResponse
      );
    });
  });

  describe("When it receives a request to delete a painting with a given id", () => {
    const deletePaintingsEndpoint = "/paintings/";
    test("Then it should respond with a status 200 response", async () => {
      const { _id: id } = await Painting.create(mockPaintings[0]);

      const expectedStatusResponse = responses.statusCode.success;

      await request(app)
        .delete(`${deletePaintingsEndpoint}${id as unknown as string}`)
        .expect(expectedStatusResponse);
    });
  });
});
