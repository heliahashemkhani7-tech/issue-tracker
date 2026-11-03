import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "node:fs";
import { PrismaClient } from "../app/generated/prisma/client";

loadEnvConfig(process.cwd());

const connectionString = process.env.PRISMA_POSTGRES_DATABASE_URL_POOLED;

if (!connectionString) {
  throw new Error("PRISMA_POSTGRES_DATABASE_URL_POOLED is missing");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

function readJson(file: string) {
  const content = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(content);
}

function toDate(value: string | null) {
  if (!value) return null;

  const normalized = value.replace(" ", "T").replace(/(\.\d{3})\d+$/, "$1");

  return new Date(`${normalized}Z`);
}

async function main() {
  const users = readJson("users.json");
  const accounts = readJson("accounts.json");
  const issues = readJson("issues.json");

  const userCount = await prisma.user.count();
  const accountCount = await prisma.account.count();
  const issueCount = await prisma.issue.count();

  if (userCount || accountCount || issueCount) {
    throw new Error("Destination database is not empty. Import cancelled.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.createMany({
      data: users.map((user: any) => ({
        ...user,
        emailVerified: toDate(user.emailVerified),
      })),
    });

    await tx.account.createMany({
      data: accounts.map((account: any) => ({
        ...account,
        expires_at:
          account.expires_at == null ? null : Number(account.expires_at),
      })),
    });

    await tx.issue.createMany({
      data: issues.map((issue: any) => ({
        ...issue,
        createdAt: toDate(issue.createdAt)!,
        updetedAt: toDate(issue.updetedAt)!,
      })),
    });

    await tx.$queryRaw`
      SELECT setval(
        pg_get_serial_sequence('"Issue"', 'id'),
        COALESCE((SELECT MAX(id) FROM "Issue"), 1),
        true
      )
    `;
  });

  console.log("Import completed successfully!");
  console.log("Users:", await prisma.user.count());
  console.log("Accounts:", await prisma.account.count());
  console.log("Issues:", await prisma.issue.count());
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
