import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePermissionFilePermission1609792357810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "PermissionFilePermission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "permissionId",
            type: "uuid",
          },
          {
            name: "fileId",
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

    await queryRunner.createForeignKeys("PermissionFilePermission", [
      new TableForeignKey({
        columnNames: ["fileId"],
        referencedColumnNames: ["id"],
        referencedTableName: "File",
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
    await queryRunner.dropTable("PermissionFilePermission");
  }
}
