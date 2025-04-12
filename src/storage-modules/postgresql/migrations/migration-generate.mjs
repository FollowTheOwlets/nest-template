import { execSync } from "child_process";

const migrationName = process.env.npm_config_name;

if (!migrationName) {
  console.log("Ошибка: необходимо задать имя миграции с помощью --name=<migration_name>");
  process.exit(1);
}

const migrationCommand =
  "ts-node ./node_modules/typeorm/cli " +
  "-d ./src/database/data-source.ts " +
  "migration:generate ./src/database/migrations/changes/" +
  migrationName;

try {
  console.log("Запуск создания миграции...");
  execSync(migrationCommand, { stdio: "inherit" });
} catch (error) {
  console.log("Ошибка создания миграции:", error);
  process.exit(1);
}
