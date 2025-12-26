import express from 'express';
import { operationRouter } from "./routes/operation.routes";

const app = express();

app.use(express.json());
app.use(operationRouter);

app.listen(3025, () => console.log(`Server started on port 3025`));

