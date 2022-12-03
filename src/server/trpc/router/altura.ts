import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { Altura } from "@altura/altura-js";
import { TRPCClientError } from "@trpc/client";
import { prisma } from "../../db/client";
import sha256 from "crypto-js/sha256";

const altura = new Altura();

export const alturaRouter = router({
  auth: publicProcedure
    .input(
      z.object({
        walletAddress: z.string().startsWith("0x").min(42).max(42),
        alturaGuardCode: z.string().min(6).max(6),
      })
    )
    .mutation(({ input }) => {
      return altura
        .authenticateUser(input.walletAddress, input.alturaGuardCode)
        .then((resp: { authenticated: boolean }) => {
          if (resp.authenticated !== true)
            throw new TRPCClientError("Authentication failed");
          const sessionId = sha256(
            input.walletAddress + input.alturaGuardCode
          ).toString();
          return prisma.user.upsert({
            where: { walletAddress: input.walletAddress },
            update: { sessionId },
            create: { walletAddress: input.walletAddress, sessionId },
          });
        });
    }),
});
