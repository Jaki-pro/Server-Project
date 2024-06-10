import { Router } from 'express';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createAcademicSemesterValidationSchema } from '../academicSemester/academicSemester.validation';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();
router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);
router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations);
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistrations,
);

router.patch(
  '/:id',
  //   validateRequest(
  //     SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  //   ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
