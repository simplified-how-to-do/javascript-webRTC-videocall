import { Request, Response } from "express";
import { getCustomRepository, getManager } from "typeorm";
import AppError from "@errors/AppError";
import User from "@models/User";
import FileRespository from "@models/File/FileRespository";
import UserRepository from "@models/User/UserRepository";

class AvatarController {
  async update(req: Request, res: Response) {
    const userRep = getCustomRepository(UserRepository);
    const fileRep = getCustomRepository(FileRespository);
    const { deleteAvatar } = req.body;

    try {
      const avatar: any = req.file && !deleteAvatar && fileRep.createWithLocalFiles(req.file)?.[0];

      if (!avatar?.ext && !deleteAvatar) {
        throw new AppError("File not found");
      }

      const oldAvatar = await fileRep.findOne(req?.user?.avatarId);

      await getManager().transaction(async (transactionalEntityManager) => {
        if (avatar?.ext) {
          await transactionalEntityManager.save(avatar);
        }

        if (oldAvatar?.id) {
          await transactionalEntityManager.remove(oldAvatar);
        }

        await transactionalEntityManager.save(User, [{ id: req.user.id, avatarId: avatar?.id || null }]);
      });

      const user = await userRep.findOne(req.user.id);

      await fileRep.unlinkUnfoundFilenames([req.file, oldAvatar]);

      return res.json(user);
    } catch (err) {
      await fileRep.unlinkUnfoundFilenames(req.file);

      throw err;
    }
  }
}

export default new AvatarController();
