import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import AppError from "@errors/AppError";
import UserRepository from "@models/User/UserRepository";

class PerfilController {
  async show(req: Request, res: Response) {
    return res.json(req.user);
  }

  async update(req: Request, res: Response) {
    const { id, avatarId, password, ...rest } = req.body;
    const { user } = req;
    const userRep = getCustomRepository(UserRepository);

    if (!user?.id) {
      throw new AppError("User not found", { statusCod: 404 });
    }

    Object.assign(user, rest);

    await userRep.save(user);

    const refreshUser = await userRep.findOne(user.id);

    delete refreshUser?.password;

    return res.json(refreshUser || user);
  }
}

export default new PerfilController();
