import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import { CustomError } from '../../domain/custom-error';

const handleCustomCodeError = (err: CustomError, req: Request, res: Response, customCode: number) => res.status(customCode).json({
  status: err.code,
  message: err.message
});

const handleValidationError = (err: HttpError, req: Request, res: Response) => res.status(err.status).json({
  message: err.message,
  errors: err.errors.map((e) => ({
    message: e.message || 'unknown',
  }))
});
const handleUnknownError = (err: CustomError, req: Request, res: Response) => res.status(500).send({
  status: 500,
  message: 'Unknown error'
});

export const handleError = (err: HttpError | CustomError, req: Request, res: Response, next: NextFunction) => {
  try {
    if ((err as HttpError).status) {
      return handleValidationError(err as HttpError, req, res);
    }

    if (!(err as CustomError).code) {
      return handleUnknownError(err as CustomError, req, res);
    }
    return handleCustomCodeError(err as CustomError, req, res, (err as CustomError).code);
  } catch (e) {
    return handleUnknownError(e, req, res);
  }
};
