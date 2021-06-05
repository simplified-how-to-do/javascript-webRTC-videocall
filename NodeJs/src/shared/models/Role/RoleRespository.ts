import { EntityRepository, Repository } from "typeorm";
import Role from ".";

@EntityRepository(Role)
class RoleRespository extends Repository<Role> {}

export default RoleRespository;
