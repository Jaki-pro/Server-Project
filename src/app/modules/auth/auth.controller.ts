import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await AuthServices.loginUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Logged in successfully',
    data: result,
  });
});

const changePassword = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await AuthServices.changePassword(req.user, req.body);
  // console.log(req.user, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is changed successfully',
    data: result,
  });
});
export const AuthControllers = {
  loginUser,
  changePassword,
};
