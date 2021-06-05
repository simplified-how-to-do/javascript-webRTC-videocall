CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS regions (
  "id" uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL
);

INSERT INTO regions ("name") VALUES ('Norte');
INSERT INTO regions ("name") VALUES ('Nordeste');
INSERT INTO regions ("name") VALUES ('Sudeste');
INSERT INTO regions ("name") VALUES ('Sul');
INSERT INTO regions ("name") VALUES ('Centro-Oeste');