// Seed script to populate dummy categories and books using CommonJS
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function upsertCategory(name) {
  return prisma.category.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function main() {
  const dataPath = path.join(__dirname, "data", "books.json");
  const raw = fs.readFileSync(dataPath, "utf-8");
  const { categories, books } = JSON.parse(raw);

  const categoryByName = {};
  for (const name of categories) {
    const cat = await upsertCategory(name);
    categoryByName[name] = cat;
  }

  for (const b of books) {
    const category = categoryByName[b.category];
    const imageUrl =
      b.imageUrl ||
      `https://picsum.photos/seed/${encodeURIComponent(
        b.isbn || b.title
      )}/600/400`;
    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {},
      create: {
        title: b.title,
        author: b.author,
        isbn: b.isbn,
        publisher: b.publisher,
        publicationDate: new Date(b.publicationDate),
        totalCopies: b.totalCopies,
        availableCopies: b.availableCopies,
        description: b.description,
        imageUrl,
        category: { connect: { id: category.id } },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
