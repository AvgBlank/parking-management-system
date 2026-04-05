import App from "@/app";
import { verifyDBConnection } from "@/shared/lib/db";
import routes from "@/routes";

async function main() {
  await verifyDBConnection();
  const app = new App(routes);
  app.startServer();
}

main();
