import { Hono } from "hono";
import { } from "./users-controller";


export const userRouter = new Hono();

// userRouter.post("/create", handleCreateUser);
// userRouter.put("/:id", handleUpdateUser);
// userRouter.delete("/:id", handleDeleteUserById);
// userRouter.get("/:id", handleGetUsersById);