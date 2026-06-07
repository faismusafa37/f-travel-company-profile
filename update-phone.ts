import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.siteSetting.upsert({
    where: { key: 'phone' },
    update: { value: '+62 8561106196' },
    create: { key: 'phone', value: '+62 8561106196' }
  });
  await prisma.siteSetting.upsert({
    where: { key: 'whatsapp_number' },
    update: { value: '628561106196' },
    create: { key: 'whatsapp_number', value: '628561106196' }
  });
  console.log('Database updated successfully');
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
