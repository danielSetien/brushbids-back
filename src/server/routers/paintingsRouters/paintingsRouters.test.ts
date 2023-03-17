import request from "supertest";
import mongoose from "mongoose";
import crypto from "crypto";
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

const paintingsEndpoint = "/paintings/";

const painting = mockPaintings[0];

describe("Given a GET paintings/ endpoint", () => {
  describe("When it receives a request to get a list of 2 paintings", () => {
    beforeAll(async () => {
      await Painting.insertMany(mockPaintings);
    });

    test("Then it should respond with a list of 2 paintings", async () => {
      const expectedPaintingsResponse = mockPaintings;

      const response: SupertestPaintingRequestResponse = await request(app).get(
        paintingsEndpoint
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

      await request(app).get(paintingsEndpoint).expect(expectedStatusResponse);
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

      const getPaintingByIdFullRoute = `${paintingsEndpoint}${paintingId}`;

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
});

describe("Given a DELETE paintings/ endpoint", () => {
  describe("When it receives a request to delete a painting with a given id", () => {
    test("Then it should respond with a status 200 response", async () => {
      const { _id: id } = await Painting.create(mockPaintings[0]);

      const expectedStatusResponse = responses.statusCode.success;

      await request(app)
        .delete(`${paintingsEndpoint}${id as unknown as string}`)
        .expect(expectedStatusResponse);
    });
  });
});

describe("Given a POST paintings/ endpoint", () => {
  describe("When it receives a request with a painting", () => {
    test("Then it should respond with status 201 and a painting", async () => {
      const expectedStatusCode = responses.statusCode.created;
      const createPaintingEndpoint = "/paintings/create";
      const appendedSuffix = "random";

      crypto.randomUUID = jest.fn().mockReturnValue(appendedSuffix);

      const expectedResponseBody = { newPainting: painting };

      const response = await request(app)
        .post(createPaintingEndpoint)
        .field("author", "Mary Heilmann")
        .field("name", "New Line Up")
        .field("year", "2018")
        .field("gallery", "Private collection")
        .field("technique", "Oil on canvas")
        .field("size", "40 x 50 in")
        .field("medium", "Painting")
        .field("materials", "Oil paint, canvas")
        .field("unique", "true")
        .field("certificate", "true")
        .field("rarity", "unique")
        .field("condition", "excellent")
        .field("signature", "true")
        .field("price", "28000")
        .field("frame", "false")
        .field("highlightOrder", "1")
        .field(
          "summary",
          "Colorful abstract painting with horizontal lines and curved shapes"
        )
        .field(
          "image",
          "https://icqwpkxwddqofeibjqcj.supabase.co/storage/v1/object/public/paitings/newLineUp.png?t=2023-03-11T16%3A09%3A57.512Z"
        )
        .attach("image", Buffer.from("uploads"), {
          filename: "paintingImage.jpg",
        })
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });
});
