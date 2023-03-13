import { CustomError } from "../../../CustomError/CustomError";
import { mockNext } from "../../../mocks/mocks";
import handlePaintingErrors from "./handlePaintingErrors";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Given a handlePaintingErrors function", () => {
  describe("When it is called with an error 'Couldn't fetch painting'", () => {
    test("Then it should pass on an error that includes the error message 'Couldn't fetch painting'", () => {
      const errorMessage = "Internal Server Error.";

      const fetchPaintingError = new CustomError(
        errorMessage,
        500,
        "Internal Server Error."
      );

      handlePaintingErrors(mockNext, errorMessage);

      expect(mockNext).toHaveBeenCalledWith(fetchPaintingError);
    });
  });

  describe("When it is called with an empty error message ''", () => {
    test("Then it should pass on an error that includes the default messge 'Internal Server Error.'", () => {
      const receivedErrorMessage = undefined as unknown as string;

      const expectedErrorMessage = "Internal Server Error.";

      const fetchPaintingError = new CustomError(
        expectedErrorMessage,
        500,
        "Internal Server Error"
      );

      handlePaintingErrors(mockNext, receivedErrorMessage);

      expect(mockNext).toHaveBeenCalledWith(fetchPaintingError);
    });
  });
});
