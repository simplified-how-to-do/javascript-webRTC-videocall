import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePermissions1609792357751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Permission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "permissionGroupId",
            type: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            // comment: "Friendly name for the permission",
          },
          {
            name: "routeName",
            isUnique: true,
            type: "varchar",
            // comment: "Describes the main Permission, must be written exactly the same as the Permission route.",
          },
          {
            name: "secret",
            type: "varchar",
            isNullable: true,
            // comment: "It is optional, if used, all requests to this route need, {headers: {routeAuthorization: 'thisSecret'}}.",
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

    await queryRunner.createForeignKey(
      "Permission",
      new TableForeignKey({
        columnNames: ["permissionGroupId"],
        referencedColumnNames: ["id"],
        referencedTableName: "PermissionGroup",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Permission");
  }
}
