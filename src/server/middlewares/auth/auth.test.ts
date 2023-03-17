import { type Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { CustomError } from "../../../CustomError/CustomError";
import { mockNext, mockResponse } from "../../../mocks/mocks";
import { type CustomRequest } from "../../../types";
import responses from "../../../utils/responses";
import auth from "./auth";

const authenticationError = new CustomError(
  "Missing authorization header",
  responses.statusCode.unauthorized,
  "Authentication failure"
);

beforeEach(() => jest.clearAllMocks());

describe("Given an auth function", () => {
  describe("When it receives a request without an authorization header", () => {
    test("Then it should call its next function with an authentication error", () => {
      const req: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValueOnce(undefined),
      };

      auth(req as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(authenticationError);
    });
  });

  describe("When it receives a request without a bearer authentication", () => {
    test("Then it should call its next function with an authentication error", () => {
      const req: Partial<CustomRequest> = {
        header: jest.fn().mockReturnValue("irrelevant"),
      };

      auth(req as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(authenticationError);
    });
  });

  describe("When it receives a request with a valid authorization", () => {
    test("Then it should call its next function with no arguments and add the property 'username' to the request", () => {
      const req: Partial<CustomRequest> = {};

      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        );

      const username = new mongoose.Types.ObjectId();
      jwt.verify = jest.fn().mockReturnValueOnce({ username });

      auth(req as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith();
      expect(req).toHaveProperty("username", username);
    });
  });

  describe("When it receives a request with an invalid authorization", () => {
    test("Then it should call its next function with the generated error message", () => {
      const req: Partial<CustomRequest> = {};

      req.header = jest
        .fn()
        .mockReturnValueOnce(
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        );

      const expectedErrorMessage = "Internal server error";

      jwt.verify = jest.fn().mockImplementationOnce(() => {
        throw new Error(expectedErrorMessage);
      });

      auth(req as CustomRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });
});
