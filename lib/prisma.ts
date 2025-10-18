import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
    // eslint-disable-next-line no-var
    var prisma: any | undefined;
}

function createClient() {
    const base = new PrismaClient({
        log: ["warn", "error"], // add "query" if you want verbose
    });
    const url = process.env.DATABASE_URL || "";
    const isAccelerate = url.startsWith("prisma+") || url.startsWith("prisma://");
    return isAccelerate ? base.$extends(withAccelerate()) : base;
}

export const prisma = global.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}
