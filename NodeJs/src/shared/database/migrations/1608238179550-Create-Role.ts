import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateRole1608238179550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "Role",
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
            name: "name",
            type: "varchar",
            // comment: "The friendly name that represents the route.",
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
      "Role",
      new TableForeignKey({
        columnNames: ["roleGroupId"],
        referencedColumnNames: ["id"],
        referencedTableName: "RoleGroup",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Role");
  }
}
