import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUser1608238179409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "User",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },

          // Perfil fields
          {
            name: "avatarId",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "birthday",
            type: "date",
            isNullable: true,
          },
          {
            name: "nationalId",
            type: "varchar",
            isNullable: true,
          },

          // Session fields
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          // Reserved to add all kind of sessions data, is full controlled by your security protocol.
          {
            name: "sessionData",
            type: "json",
            isNullable: true,
          },

          // Default table fields
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

    await queryRunner.createForeignKeys("User", [
      new TableForeignKey({
        columnNames: ["avatarId"],
        referencedColumnNames: ["id"],
        referencedTableName: "File",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("User");
  }
}
