import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'validation error',
    errorSources,
  };

  // const message = Object.values(err.errors).map((val: mongoose.Error.ValidatorError) => val.message);
  // throw new AppError(message.join(', '), httpStatus.BAD_REQUEST);
};
export default handleValidationError;
