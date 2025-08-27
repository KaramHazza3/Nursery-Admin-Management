export class UserAlreadyExist extends Error {
  constructor(message = "User is already exist") {
    super(message);
  }
};