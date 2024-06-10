import { TDays } from './offeredCourse.interface';

type TSchedule = {
  startTime: string;
  endTime: string;
  days: TDays[];
};

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
  const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);
  for (const schedule of assignedSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
