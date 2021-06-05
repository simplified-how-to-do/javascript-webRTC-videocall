import { EntityRepository, Repository } from "typeorm";
import RoleGroup from ".";

@EntityRepository(RoleGroup)
class RoleGroupRespository extends Repository<RoleGroup> {}

export default RoleGroupRespository;
