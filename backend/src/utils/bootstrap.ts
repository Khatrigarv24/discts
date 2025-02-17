import type { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import appRouter from "../api";

export async function BootstrapServer(app: Hono) {
  app.use('*', cors());
  app.use(csrf());
  app.use(secureHeaders());

  app.route("/discts", appRouter);
}
