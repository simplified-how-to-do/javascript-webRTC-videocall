import { MigrationInterface, QueryRunner, Table } from "typeorm";

/**
 * This is like the main access for modules, wich have a unique route, all roles that refers this RoleGroup,
 * have access to this route, but not all route modules.
 */
export class CreateRoleGroup1608238179500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "RoleGroup",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            // comment: "The friendly name that represents the route.",
          },
          {
            name: "routeName",
            type: "varchar",
            isUnique: true,
            // comment: "Describes the main access, must be written exactly the same as the access route.",
          },
          {
            name: "secret",
            type: "varchar",
            isNullable: true,
            // comment:
            //   "It is optional, if used, all users in that group must inform the secret inside the headers of every request like, {headers: {groupAuthorization: {[groupName]: 'groupSecrect'}}}.",
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deletedAt",
            type: "timestamp",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("RoleGroup");
  }
}
