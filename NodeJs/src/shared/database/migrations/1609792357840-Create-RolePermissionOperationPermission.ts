import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRolePermissionOperationPermissionOperationPermission1609792357840 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "RolePermissionOperationPermission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "rolePermissionId",
            type: "uuid",
          },
          {
            name: "permissionOperationId",
            type: "uuid",
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

    await queryRunner.createForeignKeys("RolePermissionOperationPermission", [
      new TableForeignKey({
        columnNames: ["rolePermissionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "RolePermission",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["permissionOperationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "PermissionOperation",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("RolePermissionOperationPermission");
  }
}
