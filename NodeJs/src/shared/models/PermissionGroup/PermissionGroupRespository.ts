import { EntityRepository, Repository } from "typeorm";
import PermissionGroup from ".";

@EntityRepository(PermissionGroup)
class PermissionGroupRespository extends Repository<PermissionGroup> {}

export default PermissionGroupRespository;
