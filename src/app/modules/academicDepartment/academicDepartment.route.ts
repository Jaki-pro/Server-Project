import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = Router();
router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartment);
router.get('/:_id', AcademicDepartmentControllers.getSingleAcademicDepartment);
router.patch(
  '/:_id',
  validateRequest(
    academicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);
export const AcademicDepartmentRoutes = router;
