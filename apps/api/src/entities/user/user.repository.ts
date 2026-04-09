import prisma from "@/lib/prisma";
import { DBUser, DBUserWithPassword } from "@/entities/user/user.types";

export interface IUserRepository {
  getAllUsers(): Promise<DBUser[]>;
  getByEmail(email: string): Promise<DBUser | null>;
  getByEmailWithPassword(email: string): Promise<DBUserWithPassword | null>;
  create(data: {
    name: string;
    email: string;
    phone: string;
    password: string | null;
    picture?: string;
  }): Promise<DBUser>;
  updatePicture(userId: string, picture: string): Promise<DBUser>;
}

export class PrismaUserRepository implements IUserRepository {
  public async getAllUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        picture: true,
      },
    });
    return users;
  }

  public async getByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        picture: true,
      },
    });
    return user;
  }

  public async getByEmailWithPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        password: true,
        picture: true,
      },
    });
    return user;
  }

  public async create(data: {
    name: string;
    email: string;
    phone: string;
    password: string | null;
  }) {
    const user = await prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        picture: true,
      },
    });
    return user;
  }

  public async updatePicture(userId: string, picture: string) {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        picture,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        picture: true,
      },
    });
    return user;
  }
}
