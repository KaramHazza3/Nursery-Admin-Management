export class TokenMissingError extends Error {
  constructor(message = "Token missing or invalid") {
    super(message);
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
  }
}