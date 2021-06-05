import { EntityRepository, Repository } from "typeorm";
import PermissionOperation from ".";

@EntityRepository(PermissionOperation)
class PermissionOperationRespository extends Repository<PermissionOperation> {}

export default PermissionOperationRespository;
