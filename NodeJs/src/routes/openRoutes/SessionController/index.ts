import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "@models/User/UserRepository";

class SessionController {
  async store(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRep = getCustomRepository(UserRepository);

    const user = await userRep.startSession(email, password);

    if (user?.sessionData?.token) {
      return res.json(user);
    }

    return res.status(404).json({ error: "User not found" });
  }
}

export default new SessionController();
