// Package imports
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient = null;

class PrismaService {
  static getInstance = (): PrismaClient => {
    if (prisma) {
      return prisma;
    }

    prisma = new PrismaClient();
    return prisma;
  };

  static disconnectInstance = () => {
    if (prisma) {
      prisma.$disconnect();
    }
  };
}

export default PrismaService;
