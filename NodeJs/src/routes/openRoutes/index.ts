import { Router } from "express";
import SessionController from "./SessionController";
import CreateUserController from "./CreateUserController";

const openRoutes = Router();

openRoutes.post("/createUser", CreateUserController.store);

openRoutes.post("/session", SessionController.store);

export default openRoutes;
