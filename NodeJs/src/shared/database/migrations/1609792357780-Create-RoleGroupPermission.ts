import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRoleGroupPermission1609792357780 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "RoleGroupPermission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "roleGroupId",
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

    await queryRunner.createForeignKeys("RoleGroupPermission", [
      new TableForeignKey({
        columnNames: ["roleGroupId"],
        referencedColumnNames: ["id"],
        referencedTableName: "RoleGroup",
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
    await queryRunner.dropTable("RoleGroupPermission");
  }
}
