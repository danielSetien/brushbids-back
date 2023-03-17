import { type Response } from "express";
import fs from "fs/promises";
import { CustomError } from "../../../CustomError/CustomError";
import { Painting } from "../../../database/models/PaintingSchema";
import {
  mockNext,
  mockPaintings,
  mockRequest,
  mockResponse,
} from "../../../mocks/mocks";
import { type CustomRequest } from "../../../types";
import responses from "../../../utils/responses";
import {
  createPainting,
  deletePainting,
  getPaintingById,
  getPaintings,
} from "./paintingControllers";

beforeEach(() => jest.clearAllMocks());

const thrownErrorMessage = "Service Unavailable";
const thrownStatusCode = 503;
const thrownPublicErrorMessage = thrownErrorMessage;

const expectedThrownError = new CustomError(
  thrownErrorMessage,
  thrownStatusCode,
  thrownPublicErrorMessage
);

describe("Given a getPaintings controller", () => {
  describe("When it receives a response", () => {
    test("Then it should call its response function's status method with value 200", async () => {
      const expectedStatusCode = responses.statusCode.success;

      Painting.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPaintings),
      }));

      await getPaintings(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its response function's json method with a list of paintings", async () => {
      const mockExpectedPaintingsCall = { paintings: mockPaintings };

      Painting.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPaintings),
      }));

      await getPaintings(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(mockExpectedPaintingsCall);
    });
  });

  describe("When it receives an error with message 'Service Unavailable'", () => {
    test("Then it should handle it and pass it on with its next function", async () => {
      Painting.find = jest.fn().mockImplementationOnce(() => {
        throw new Error(thrownErrorMessage);
      });

      await getPaintings(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedThrownError);
    });
  });
});

describe("Given a getPaintingById controller", () => {
  const paintingId = "irrelevantId";

  mockRequest.params = { idPainting: paintingId };

  describe("When it receives a request with a painting's identification", () => {
    test("Then it should call its response function's status method with value 200", async () => {
      const expectedStatusCode = responses.statusCode.success;

      Painting.findById = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPaintings[0]),
      }));

      await getPaintingById(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its response function's json method with a painting", async () => {
      const mockExpectedPaintingsCall = { paintings: mockPaintings[0] };

      Painting.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockPaintings[0]),
      }));

      await getPaintings(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalledWith(mockExpectedPaintingsCall);
    });
  });

  describe("When it receives an error with message 'Service Unavailable'", () => {
    test("Then it should handle it and pass it on with its next function", async () => {
      Painting.findById = jest.fn().mockImplementationOnce(() => {
        throw new Error(thrownErrorMessage);
      });

      await getPaintingById(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedThrownError);
    });
  });
});

describe("Given a deletePainting controller", () => {
  describe("When it receives a request with a painting's identification", () => {
    test("Then it should call its response function's status method with value 200", async () => {
      const expectedStatusCode = responses.statusCode.success;

      Painting.findByIdAndDelete = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn(),
      }));

      await deletePainting(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives an error with message 'Service Unavailable'", () => {
    test("Then it should handle it and pass it on with its next function", async () => {
      Painting.findByIdAndDelete = jest.fn().mockImplementationOnce(() => {
        throw new Error(thrownErrorMessage);
      });

      await deletePainting(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedThrownError);
    });
  });
});

describe("Given a createPainting controller", () => {
  const req: Partial<CustomRequest> = {
    body: mockPaintings[0],
  };

  describe("When it receives a request with a painting", () => {
    const mockFile = {
      filename: mockPaintings[0].name,
    };

    const submittedPainting = mockPaintings[0];

    test("Then it should call its response function's status method with value 201", async () => {
      const expectedStatusCode = responses.statusCode.created;

      const req = {
        body: submittedPainting,
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      fs.readFile = jest.fn().mockImplementationOnce(() => mockFile.filename);

      Painting.create = jest.fn().mockReturnValue({});

      await createPainting(
        req as CustomRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call its response function's json method with the created paintings", async () => {
      const req = {
        body: submittedPainting,
        file: {
          filename: "haha salu2",
        },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockResolvedValue({
          submittedPainting,
        }),
      };

      fs.readFile = jest.fn().mockImplementationOnce(() => mockFile.filename);

      Painting.create = jest.fn().mockReturnValue({});

      await createPainting(
        req as CustomRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        newPainting: mockPaintings[0],
      });
    });
  });

  describe("When it receives an error with message 'Service Unavailable'", () => {
    test("Then it should handle it and pass it on with its next function", async () => {
      Painting.create = jest.fn().mockImplementationOnce(() => {
        throw new Error(thrownErrorMessage);
      });

      await createPainting(
        req as CustomRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(expectedThrownError);
    });
  });
});
