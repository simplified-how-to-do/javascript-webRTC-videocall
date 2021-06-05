import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import UserRepository from "@models/User/UserRepository";
import bcrypt from "bcryptjs";
import AppError from "@errors/AppError";

class PasswordController {
  async update(req: Request, res: Response) {
    const { id } = req.user;
    const { newPassword, oldPassword } = req.body;
    const userRep = getCustomRepository(UserRepository);

    const user = await userRep.findOne({ where: { id }, select: ["id", "password"] });

    if (!(user?.password && (await bcrypt.compare(oldPassword, user.password)))) {
      throw new AppError("Incorrect old password");
    }

    user.password = newPassword;

    await userRep.save(user);

    const refreshUser = await userRep.findOne(id);

    delete refreshUser?.password;

    return res.json(refreshUser);
  }
}

export default new PasswordController();
