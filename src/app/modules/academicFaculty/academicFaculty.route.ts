import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyValidations } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';

const router = Router();
router.post(
  '/create-academic-faculty',
  validateRequest(
    academicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);
router.get('/', AcademicFacultyControllers.getAllAcademicFaculties);
router.get('/:_id', AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  '/:_id',
  validateRequest(
    academicFacultyValidations.updateAdemicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);
export const AcademicFacultyRoutes = router;
