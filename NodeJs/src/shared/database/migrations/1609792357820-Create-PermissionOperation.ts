import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreatePermissionOperation1609792357820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "PermissionOperation",
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
            isUnique: true,
          },
          {
            name: "routeName",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "secret",
            type: "varchar",
            isNullable: true,
            // comment: "It is optional, if used, all requests to this route operation need, {headers: {routeOperatorAuthorization: 'thisSecret'}}.",
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
    await queryRunner.dropTable("PermissionOperation");
  }
}
