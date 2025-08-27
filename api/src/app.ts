import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import userRouter from '@/routes/user.router';
import classesRouter from '@/routes/classes.router';
import childrenRouter from '@/routes/children.router';
import notificationRouter from '@/routes/notifcation.router';
import adminRouter from '@/routes/admin.router.private';
import { API_PREFIX } from "@/constants";
import errorHandler from "./middlewares/errorHandler";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { authenticate } from "./middlewares/authentication";
import { isAdmin } from "./middlewares/authorization";
import asyncHandler from "./utils/async-handler";

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(`${API_PREFIX}`, adminRouter);

app.use(asyncHandler(authenticate));
app.use(asyncHandler(isAdmin));

app.use(`${API_PREFIX}/users`, userRouter); 
app.use(`${API_PREFIX}/classes`, classesRouter); 
app.use(`${API_PREFIX}/children`, childrenRouter);
app.use(`${API_PREFIX}/notifications`, notificationRouter);

app.use(errorHandler);

export default app;