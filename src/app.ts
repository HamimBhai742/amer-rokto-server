import express, { Application } from "express";
import cors from "cors";
import { router } from "./app/routes";
import notFound from "./app/utils/not.found";
import globalErrorHandler from "./app/middleware/global.error";

export const app: Application = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.send("Server is running........");
});

app.use(notFound);

app.use(globalErrorHandler);
