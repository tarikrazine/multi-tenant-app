import { logger } from "./utils/logger";
import { buildServer } from "./utils/server";

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  await app.listen({
    port: 3000,
  });

  const signals = ["SIGINT", "SIGTERM"];

  for (const signal of signals) {
    process.on(signal, () => {
      console.log("Got signal", signal);
      gracefulShutdown({
        app,
      });
    });
  }

  logger.info("Server is Running at http://localhost:3000");
}

main();
