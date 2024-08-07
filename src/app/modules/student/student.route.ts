import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
const router = express.Router();
router.get('/', StudentControllers.getAllStudents);
router.get(
  '/:id',
  auth('student', 'faculty', 'admin'),
  StudentControllers.getSingleStudent,
);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);
router.delete('/:id', StudentControllers.deleteStudent);

export const StudentRoutes = router;
