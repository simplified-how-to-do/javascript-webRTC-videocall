import { EntityRepository, Repository } from "typeorm";
import Permission from ".";

@EntityRepository(Permission)
class PermissionRespository extends Repository<Permission> {}

export default PermissionRespository;
