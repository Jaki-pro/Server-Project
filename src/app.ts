import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoutes } from './app/modules/student/student.route';
const app: Application = express();
app.use(express.json());
app.use(cors());
//application routes
app.use('/api/v1/students', StudentRoutes);
app.get('/', (req: Request, res: Response) => {
  const a = 10;
  res.status(200).json({ a });
});
export default app;
