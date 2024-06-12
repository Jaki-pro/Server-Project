import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // validation
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    const { userId, role, iat } = decoded;
    // checking if the user exists
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      // custom static method
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // checking if the user is already deleted
    if (user?.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'User is deleted');
    }

    // checking if the user is already blocked
    if (user?.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'User is already blocked');
    }

    // checking if jwt issued time is before password changed time

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }
    if (requiredRoles && !requiredRoles.includes(decoded.role)) {
      // checking if the given token is valid
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
    }
    req.user = decoded;
    next();
  });
};
export default auth;
