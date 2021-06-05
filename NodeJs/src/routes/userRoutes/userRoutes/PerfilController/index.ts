import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import AppError from "@errors/AppError";
import UserRepository from "@models/User/UserRepository";

class PerfilController {
  async show(req: Request, res: Response) {
    return res.json(req.user);
  }

  async update(req: Request, res: Response) {
    const { id, ...rest } = req.body;
    const userRep = getCustomRepository(UserRepository);

    const user: any = req.user;

    if (!user?.id) {
      throw new AppError("User not found", { statusCod: 404 });
    }

    Object.entries(rest).forEach(([k, v]) => {
      user[k] = v;
    });

    await userRep.save(user);

    delete user.password;

    return res.json(user);
  }
}

export default new PerfilController();
