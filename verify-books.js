// Script to verify that the books were inserted correctly
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Verifying book data in the database...\n");

  // Get all categories
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
  });

  console.log("Categories created:");
  categories.forEach((cat) => {
    console.log(`- ${cat.name} (${cat._count.books} books)`);
  });

  console.log("\nBooks created:");
  const books = await prisma.book.findMany({
    include: {
      category: true,
    },
    orderBy: {
      title: "asc",
    },
  });

  books.forEach((book) => {
    console.log(`- ${book.title} by ${book.author} (${book.category.name})`);
    console.log(
      `  ISBN: ${book.isbn}, Available: ${book.availableCopies}/${book.totalCopies}`
    );
  });

  console.log(`\nTotal books in database: ${books.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error verifying database:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
