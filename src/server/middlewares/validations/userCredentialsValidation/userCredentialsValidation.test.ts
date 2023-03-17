import { type Response } from "express";
import { mockRequest, mockResponse } from "../../../../mocks/mocks";
import responses from "../../../../utils/responses";
import userCredentialsValidation from "./userCredentialsValidation";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a userCredentialsValidation function", () => {
  describe("When it receives a short email 'u@g.com'", () => {
    test("Then it should call its next function with private message 'Invalid user credentials', status 400 and public message 'email length must be at least 8 characters long'", () => {
      const invalidEmail = "s@g.com";

      const expectedPrivateMessage = "Invalid user credentials";
      const expectedStatus = responses.statusCode.invalidUserCredentials;
      const expectedPublicMessage =
        "email length must be at least 8 characters long";

      mockRequest.body = {
        email: invalidEmail,
        password: "validPassword",
      };

      const next = jest.fn();

      userCredentialsValidation(mockRequest, mockResponse as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "message",
        expectedPrivateMessage
      );

      expect(next.mock.calls[0][0]).toHaveProperty(
        "statusCode",
        expectedStatus
      );

      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        expectedPublicMessage
      );
    });
  });

  describe("When it receives a short password '1234'", () => {
    test("Then it should call its next function with private message 'Invalid user credentials', status 400 and public message 'password length must be at least 8 characters long'", () => {
      const invalidPassword = "1234";

      const expectedPrivateMessage = "Invalid user credentials";
      const expectedStatus = responses.statusCode.invalidUserCredentials;
      const expectedPublicMessage =
        "password length must be at least 8 characters long";

      mockRequest.body = {
        email: "irrelevant@gmail.com",
        password: invalidPassword,
      };

      const next = jest.fn();

      userCredentialsValidation(mockRequest, mockResponse as Response, next);

      expect(next.mock.calls[0][0]).toHaveProperty(
        "publicMessage",
        expectedPublicMessage
      );
    });
  });
});
