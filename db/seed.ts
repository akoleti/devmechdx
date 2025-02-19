import { PrismaClient } from '@prisma/client';
import { sa } from './sample-data';


async function main() {
  const prisma = new PrismaClient();
  await prisma.industry.deleteMany();
  await prisma.caseStudy.deleteMany();
  await prisma.caseStudyIndustry.deleteMany();
  await prisma.industrySolution.deleteMany();
  await prisma.caseStudyIndustry.deleteMany();

  await prisma.caseStudy.createMany({
    data: sa.caseStudies
  });

  await prisma.industry.createMany({
    data: sa.industries
  });

  await prisma.industrySolution.createMany({
    data: sa.industrySolutions
  });

  await prisma.caseStudyIndustry.createMany({
    data: sa.caseStudyIndustries
  });

}

main();