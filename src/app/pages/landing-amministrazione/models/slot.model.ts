import { Resource } from './resource.model';

export interface Slot {
  id: number;
  title: string;
  dateStart: Date;
  dateEnd: Date;
  note: string;
  free: boolean;
  resource: Resource;
}