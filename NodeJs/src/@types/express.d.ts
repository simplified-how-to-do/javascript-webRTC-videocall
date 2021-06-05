import User from "../models/entities/User";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
