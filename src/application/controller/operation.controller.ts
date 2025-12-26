import { Request, Response } from 'express';
import { CreateOperationUseCase } from '../use-case/create-operation.use-case';

export class CreateOperationController {
    constructor(private readonly createOperation: CreateOperationUseCase) {}

    async handle(req: Request, res: Response): Promise<Response> {
        const { external_id, amount, currency } = req.body;

        if (!external_id || !amount || !currency) {
            return res.status(400).json({
                message: 'Invalid payload'
            });
        }

        try {
            const result = await this.createOperation.execute({
                external_id,
                amount,
                currency
            });
            return res.status(200).json(result);

        } catch (error: any) {
            if (error.message.includes('Payload conflict')) {
                return res.status(409).json({
                    message: 'Payload differs from original request'
                });
            }
            throw error;
        }
    }
}
