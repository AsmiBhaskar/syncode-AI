import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const createUser = async ({ company, user }) => {
  return prisma.user.create({
    data: {
      ...user,
      company: { create: company },
    },
    include: { company: true },
  });
};

export const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: { email },
    include: { company: true },
  });
};
