import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL та ADMIN_PASSWORD мають бути задані в .env");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: "SUPERADMIN",
    },
  });

  console.log(`Адмін створений/оновлений: ${admin.email}`);

  const services = [
    {
      slug: "battery-diagnostics",
      titleUk: "Діагностика батареї",
      titleEn: "Battery Diagnostics",
      descUk: "Повна перевірка стану батареї, модулів та системи керування (BMS)",
      descEn: "Full battery, module and battery management system (BMS) health check",
      price: 500,
      duration: "1-2 год",
      order: 0,
    },
    {
      slug: "module-replacement",
      titleUk: "Заміна модулів батареї",
      titleEn: "Battery Module Replacement",
      descUk: "Заміна пошкоджених або деградованих модулів батареї на справні",
      descEn: "Replacement of damaged or degraded battery modules with working ones",
      price: 3000,
      duration: "1-2 дні",
      order: 1,
    },
    {
      slug: "cell-balancing",
      titleUk: "Балансування елементів",
      titleEn: "Cell Balancing",
      descUk: "Вирівнювання напруги між елементами батареї для збільшення запасу ходу",
      descEn: "Balancing voltage across battery cells to restore range",
      price: 1500,
      duration: "3-4 год",
      order: 2,
    },
    {
      slug: "bms-calibration",
      titleUk: "Калібрування BMS",
      titleEn: "BMS Calibration",
      descUk: "Оновлення та калібрування системи керування батареєю",
      descEn: "Updating and calibrating the battery management system",
      price: 1000,
      duration: "2-3 год",
      order: 3,
    },
    {
      slug: "cooling-system-repair",
      titleUk: "Ремонт системи охолодження",
      titleEn: "Cooling System Repair",
      descUk: "Усунення витоків та обслуговування контуру охолодження батареї",
      descEn: "Fixing leaks and servicing the battery cooling loop",
      price: 2500,
      duration: "1 день",
      order: 4,
    },
    {
      slug: "battery-replacement",
      titleUk: "Заміна батареї в зборі",
      titleEn: "Full Battery Replacement",
      descUk: "Демонтаж старої та встановлення нової або відновленої батареї",
      descEn: "Removal of the old battery and installation of a new or refurbished one",
      price: 15000,
      duration: "1 день",
      order: 5,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }

  console.log(`Послуги створені/оновлені: ${services.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
