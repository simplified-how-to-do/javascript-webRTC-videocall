import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUserFilePermission1608238179420 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "UserFilePermission",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "userId",
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

    await queryRunner.createForeignKeys("UserFilePermission", [
      new TableForeignKey({
        columnNames: ["fileId"],
        referencedColumnNames: ["id"],
        referencedTableName: "File",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "User",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("UserFilePermission");
  }
}
