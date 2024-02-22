import { Timestamp } from "@angular/fire/firestore";
import { IPatent } from "../patents/IPatent";

export interface IToken {
  number: number;
  patentId: string;
  id: string;
  arrivalTime: Timestamp;
  visitPurpose: string;
  temperature: number;
  heartRate: number;
  bloodPressure: number;
  doctorCheckUpStart: Timestamp;
  doctorCheckUpEnd: Timestamp;
}

export interface ITokenWithPatent extends IToken {
  patent: IPatent;
}
