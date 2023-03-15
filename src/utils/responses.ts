interface Responses {
  success: {
    statusCode: number;
  };
  invalidUserCredentials: {
    statusCode: number;
  };
  internalServerError: {
    statusCode: number;
  };
}

const responses: Responses = {
  success: {
    statusCode: 200,
  },
  invalidUserCredentials: {
    statusCode: 400,
  },
  internalServerError: {
    statusCode: 500,
  },
};

export default responses;
