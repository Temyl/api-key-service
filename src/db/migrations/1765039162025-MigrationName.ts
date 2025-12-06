import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1765039162025 implements MigrationInterface {
    name = 'MigrationName1765039162025'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "service_key" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "key" character varying NOT NULL, "name" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "expires_at" TIMESTAMP, "ownerId" uuid, CONSTRAINT "UQ_cd13fa8ca4a3f80f9fa01688e5c" UNIQUE ("key"), CONSTRAINT "PK_6ea9862b84d09c9a54e818aadc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying, "full_name" character varying, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_key" ADD CONSTRAINT "FK_4e36d85117a62a159c7504e6e0b" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_key" DROP CONSTRAINT "FK_4e36d85117a62a159c7504e6e0b"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "service_key"`);
    }

}
