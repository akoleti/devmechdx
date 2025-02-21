import { PrismaClient } from '@prisma/client';
import { sa } from './sample-data';


async function main() {
  const prisma = new PrismaClient();
  await prisma.user.deleteMany();


  await prisma.user.createMany({
    data: sa.users
  });

  

  

  

}

main();