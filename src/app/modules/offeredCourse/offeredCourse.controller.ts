import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created successfully',
    data: result,
  });
});
const getAllOfferedCourse = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await OfferedCourseServices.getAllOfferedCourseFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses are retrieved successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is retrieved successfully',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is updated successfully',
    data: result,
  });
});

const deleteOfferedCourse = catchAsync(async (req, res) => {
  // console.log(req.body);
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(
    req.params.id,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is Deleted successfully',
    data: result,
  });
});
export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  deleteOfferedCourse,
};
