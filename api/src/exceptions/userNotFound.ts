export class UserNotFound extends Error {
  constructor(message = "User not found") {
    super(message);
  }
};