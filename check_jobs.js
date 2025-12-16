const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const jobs = await prisma.jobVacancy.findMany();
  console.log("Current Jobs in DB:");
  jobs.forEach((job) => {
    console.log(`- ${job.title} (${job.company}): ${job.status}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
