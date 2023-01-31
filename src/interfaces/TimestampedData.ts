import { StringIndex } from "./StringIndex";

export interface TimestampedData extends StringIndex {
  date: Date;
}
