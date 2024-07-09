import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { EnrolledCourseValidatins } from './enrolledCourse.validation';
import auth from '../../middlewares/auth';

const router = Router();
router.post(
  '/create-enrolled-course',
  auth('student'),
  validateRequest(EnrolledCourseValidatins.createEnrolledValidationSchema),
  EnrolledCourseControllers.createEnrolledCourse,
);
router.patch(
  '/update-enrolled-course',
  auth('faculty'),
  validateRequest(
    EnrolledCourseValidatins.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);
export const EnrolledCourseRoutes = router;
