import { type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CustomError } from "../../../CustomError/CustomError";
import { User } from "../../../database/models/UserSchema";
import { mockNext, mockRequest, mockResponse } from "../../../mocks/mocks";
import { type UserCredentials } from "../../../types";
import { loginUser } from "./userControllers";
import responses from "../../../utils/responses";

beforeEach(() => jest.clearAllMocks());

describe("Given a loginUser controller", () => {
  describe("When it receives a request with an email 'unregistered@gmail.com' and password 'unimportant'", () => {
    test("Then it should deny the authorization", async () => {
      const mockUnregisteredUser: UserCredentials = {
        email: "unregistered@gmail.com",
        password: "unimportant",
      };

      const expectedPrivateMessage = "Invalid email.";
      const expectedStatus = 401;
      const expectedPublicMessage =
        "The combination loginname and password is incorrect, please try again.";

      const expectedError = new CustomError(
        expectedPrivateMessage,
        expectedStatus,
        expectedPublicMessage
      );

      mockRequest.body = mockUnregisteredUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an email 'registered@gmail.com' and password 'invalidPassword'", () => {
    test("Then it should deny the authorization", async () => {
      const mockRegisteredUser: UserCredentials = {
        email: "registered@gmail.com",
        password: "invalidPassword",
      };

      const expectedPrivateMessage = "Invalid password.";
      const expectedStatus = 401;
      const expectedPublicMessage =
        "The combination loginname and password is incorrect, please try again.";

      const expectedError = new CustomError(
        expectedPrivateMessage,
        expectedStatus,
        expectedPublicMessage
      );

      mockRequest.body = mockRegisteredUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockRegisteredUser),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an email 'registered@gmail.com' and password 'correctPassword'", () => {
    test("Then it should produce the authorization token and status 200", async () => {
      const mockRegisteredUser: UserCredentials = {
        email: "registered@gmail.com",
        password: "correctPassword",
      };

      const expectedStatus = 200;
      const expectedToken = "token";

      mockRequest.body = mockRegisteredUser;

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(mockRegisteredUser),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      jwt.sign = jest.fn().mockReturnValue(expectedToken);

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatus);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: expectedToken });
    });
  });

  describe("When it receives a request but there's an Internal Server Error during the login process", () => {
    test("Then it should signal so with an 'Internal Server Error.' public and private message and a status 500", async () => {
      const customError = new CustomError(
        "Internal server error",
        responses.statusCode.internalServerError,
        "Internal server error"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => {
        throw new Error("Internal server error");
      });

      await loginUser(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(customError);
    });
  });
});
