import { PrismaClient } from "@g/prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default services
  const services = await prisma.service.createMany({
    data: [
      {
        slug: "battery-diagnostics",
        titleUk: "Діагностика батареї",
        titleEn: "Battery Diagnostics",
        descUk: "Повна перевірка стану батареї та її компонентів",
        descEn: "Full battery health check and component inspection",
        price: 50000, // In kopiyky (UAH)
        duration: "1 час",
        order: 1,
      },
      {
        slug: "battery-replacement",
        titleUk: "Заміна батареї",
        titleEn: "Battery Replacement",
        descUk: "Заміна всієї батареї на нову",
        descEn: "Complete battery replacement with new unit",
        price: 300000,
        duration: "4-6 годин",
        order: 2,
      },
      {
        slug: "module-replacement",
        titleUk: "Заміна модулів",
        titleEn: "Module Replacement",
        descUk: "Заміна пошкоджених модулів батареї",
        descEn: "Replace damaged battery modules",
        price: 100000,
        duration: "2-3 години",
        order: 3,
      },
    ],
  });

  console.log(`Created ${services.count} services`);

  // Create demo review
  await prisma.review.create({
    data: {
      author: "John Smith",
      rating: 5,
      textUk: "Відмінний сервіс! Батарея працює як нова.",
      textEn: "Excellent service! Battery works like new.",
      carModel: "Tesla Model 3",
      isVisible: true,
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
