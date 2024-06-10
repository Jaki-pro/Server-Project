import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  // console.log(req.query);
  const result = await AdminServices.getAllAdminsFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins retrieved successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  // console.log(req.query);
  const result = await AdminServices.getSingleAdminFromDB(
    req.params.id,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is retrieved successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const updateData = req.body.admin;
  const result = await AdminServices.updateAdminIntoDB(adminId, updateData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const adminId = req.params.id;
  const result = await AdminServices.deleteAdminFromDB(adminId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin deleted successfully',
    data: result,
  });
});
export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
