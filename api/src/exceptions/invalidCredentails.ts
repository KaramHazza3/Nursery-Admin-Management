export class InvalidCredentials extends Error {
  constructor(message = "Invalid Credentials") {
    super(message);
  }
};