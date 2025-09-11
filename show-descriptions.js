// Script to display the enhanced book descriptions
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Enhanced Book Descriptions:\n");
  console.log("=" * 80);

  const books = await prisma.book.findMany({
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  books.forEach((book, index) => {
    console.log(`\n${index + 1}. ${book.title}`);
    console.log(`   Author: ${book.author}`);
    console.log(`   Category: ${book.category.name}`);
    console.log(`   ISBN: ${book.isbn}`);
    console.log(`   Available: ${book.availableCopies}/${book.totalCopies}`);
    console.log(`   Description:`);
    console.log(`   ${book.description}`);
    console.log("\n" + "-".repeat(80));
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
