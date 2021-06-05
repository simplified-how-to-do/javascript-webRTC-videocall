import { Router } from "express";
import perfilRoutes from "./perfilRoutes";

const authenticatedRoutes = Router();

authenticatedRoutes.use("/perfil", perfilRoutes);

export default authenticatedRoutes;
