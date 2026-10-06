import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// DATABASE_URL stays in mysql:// form for the Prisma CLI (db push / migrate),
// but the mariadb driver only accepts mariadb:// URLs, so pass a config object.
const createAdapter = () => {
  const url = new URL(process.env.DATABASE_URL!);
  return new PrismaMariaDb({
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 5,
  });
};

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter: createAdapter() });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Cache in every environment so all server bundles share one client and pool.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();
globalThis.prismaGlobal = prisma;

export default prisma;
