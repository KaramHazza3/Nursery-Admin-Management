export class NotAdmin extends Error {
  constructor(message = "User is not an admin") {
    super(message);
  }
};