const { PrismaClient } = '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Example: Creating sample notes
  await prisma.note.createMany({
    data: [
      { title: 'First Note', content: 'This is the first note' },
      { title: 'Second Note', content: 'This is the second note' },
    ],
  });
  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
