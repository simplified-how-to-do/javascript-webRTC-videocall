import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateFile1608238174395 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "File",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "originalname",
            type: "varchar",
          },
          {
            name: "filename",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "ext",
            type: "varchar",
          },
          {
            name: "isPublic",
            type: "boolean",
            default: false,
          },
          {
            name: "checkUserPermissions",
            type: "boolean",
            default: false,
          },
          {
            name: "checkRoutePermissions",
            type: "boolean",
            default: false,
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
    await queryRunner.dropTable("File");
  }
}
