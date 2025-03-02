import type { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { secureHeaders } from "hono/secure-headers";
import appRouter from "../api";

export async function BootstrapServer(app: Hono) {
  app.use('*', cors({
    origin: '*', // In production you should restrict this
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'x-csrf-disable'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
  }));
  
  // Disable CSRF for requests with the x-csrf-disable header
  app.use(async (c, next) => {
    if (c.req.header('x-csrf-disable') === 'true') {
      return next();
    }
    
    // Apply CSRF protection for all other requests
    return csrf()(c, next);
  });
  
  app.use(secureHeaders());

  app.route("/discts", appRouter);
}
