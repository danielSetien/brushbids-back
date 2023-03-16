interface Responses {
  statusCode: {
    success: number;
    invalidUserCredentials: number;
    internalServerError: number;
    unauthorized: number;
    created: number;
  };
}

const responses: Responses = {
  statusCode: {
    success: 200,
    invalidUserCredentials: 400,
    internalServerError: 500,
    unauthorized: 401,
    created: 201,
  },
};

export default responses;
