import { AcademicFacultyServices } from './academicFaculty.service';

import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.model';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );
  sendResponse(res, {
    statusCode: 500,
    success: true,
    message: 'Academic faculty is created successfully',
    data: result,
  });
});
const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getAllAcademicFacultiesFromDB();
  sendResponse(res, {
    statusCode: 500,
    success: true,
    message: 'Academic faculties are retrieved successfully',
    data: result,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(
    req.params._id,
  );
  sendResponse(res, {
    statusCode: 500,
    success: true,
    message: 'Academic faculty is retrieved successfully',
    data: result,
  });
});
const updateAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.updateAcademicFacultyIntoDB(
    req.params._id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 500,
    success: true,
    message: 'Academic faculty is updated successfully',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
