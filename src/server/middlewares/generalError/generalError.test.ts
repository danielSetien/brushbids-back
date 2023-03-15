import { type Response } from "express";
import { CustomError } from "../../../CustomError/CustomError";
import { mockNext, mockRequest, mockResponse } from "../../../mocks/mocks";
import responses from "../../../utils/responses";
import { generalError } from "./generalError";

describe("Given a generalError function", () => {
  describe("When it receives an error with status code 501", () => {
    test("Then it should show an error with status code 501", () => {
      const statusCode = 501;
      const mockError = new CustomError("", statusCode, "Undetermined message");

      generalError(mockError, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives an error with the public message 'Bad request'", () => {
    test("Then it should show the client an error with message 'Bad request'", () => {
      const errorMessage = "Bad request";
      const mockError = new CustomError(
        "",
        responses.invalidUserCredentials.statusCode,
        errorMessage
      );

      generalError(mockError, mockRequest, mockResponse as Response, mockNext);

      const expectedErrorWithMessage = { error: errorMessage };

      expect(mockResponse.json).toHaveBeenCalledWith(expectedErrorWithMessage);
    });
  });

  describe("When it receives an error with an invalid status code'", () => {
    test("Then it should show the client an error with status 500", () => {
      const invalidStatusCode = NaN;
      const mockError = new CustomError(
        "",
        invalidStatusCode,
        "Undetermined message"
      );
      const expectedStatusCode = responses.internalServerError.statusCode;

      generalError(mockError, mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(expectedStatusCode);
    });
  });

  describe("When it receives an error without a custom message defined", () => {
    test("Then it should show the client the default message 'Something went wrong'", () => {
      const errorMessage = "";
      const mockError = new CustomError(
        "",
        responses.invalidUserCredentials.statusCode,
        errorMessage
      );

      generalError(mockError, mockRequest, mockResponse as Response, mockNext);

      const expectedErrorWithMessage = { error: "Something went wrong" };

      expect(mockResponse.json).toHaveBeenCalledWith(expectedErrorWithMessage);
    });
  });
});
