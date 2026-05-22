import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";


const adapter = new PrismaPg({
  connectionString: process.env.DB_URI!,
});


export const db = new PrismaClient({ adapter });