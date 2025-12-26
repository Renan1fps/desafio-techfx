import { Router } from 'express';
import { OperationDao } from "../../infra/databse/operation.dao";
import { CreateOperationUseCase } from "../../application/use-case/create-operation.use-case";
import { CreateOperationController } from "../../application/controller/operation.controller";

const operationRouter = Router();

const operationDAO = new OperationDao();
const useCase = new CreateOperationUseCase(operationDAO);
const controller = new CreateOperationController(useCase);

operationRouter.post('/operations', (req, res) =>
    controller.handle(req, res)
);

export { operationRouter };
