import prisma from './src/lib/prisma';

async function main() {
  const settings = await prisma.siteSetting.findMany();
  console.log(settings.map(s => s.key));
}

main().catch(console.error).finally(() => prisma.$disconnect());
