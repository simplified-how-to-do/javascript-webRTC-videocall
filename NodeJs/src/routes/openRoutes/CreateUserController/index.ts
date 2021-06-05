import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "@models/User/UserRepository";

class CreateUserController {
  async store(req: Request, res: Response) {
    const userData: Object = req.body;
    const userRep = getCustomRepository(UserRepository);

    const user = userRep.create(userData);

    await userRep.save(user);

    delete user.password;

    return res.json(user);
  }
}

export default new CreateUserController();
