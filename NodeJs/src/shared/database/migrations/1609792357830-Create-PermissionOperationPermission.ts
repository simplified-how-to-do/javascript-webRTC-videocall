import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePermissionOperationPermission1609792357820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "PermissionOperationPermission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "permissionOperationId",
            type: "uuid",
          },
          {
            name: "permissionId",
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

    await queryRunner.createForeignKeys("PermissionOperationPermission", [
      new TableForeignKey({
        columnNames: ["permissionOperationId"],
        referencedColumnNames: ["id"],
        referencedTableName: "PermissionOperation",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["permissionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "Permission",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("PermissionOperationPermission");
  }
}
