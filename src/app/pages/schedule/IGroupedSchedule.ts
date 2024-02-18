import { ISchedule } from "./ISchedule";

export interface IGroupedSchedule {
  time: string;
  sessions: ISchedule[];
}
