export class ForbiddenException extends Error {
  constructor(message = "Access denied.") {
    super(message);
  }
};