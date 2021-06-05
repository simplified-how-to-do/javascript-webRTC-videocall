import { Router } from "express";
import uploaderMiddleware from "../../_infra/middlewares/uploaderMiddleware";
import AvatarController from "./AvatarController";
import PasswordController from "./PasswordController";
import PerfilController from "./PerfilController";

const perfilRoutes = Router();

perfilRoutes.get("/", PerfilController.show);
perfilRoutes.put("/", PerfilController.update);

perfilRoutes.put("/avatar", uploaderMiddleware({ imageOnly: true }).single("file"), AvatarController.update);

perfilRoutes.put("/password", PasswordController.update);

export default perfilRoutes;
