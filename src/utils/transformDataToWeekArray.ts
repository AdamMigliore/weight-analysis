import Healthpoint from "@/interfaces/Healthpoint";
import { DateTime } from "luxon";

export function transformDataToWeekArray(arr: Healthpoint[]) {
  const calendar = new Map<number, Map<number, Healthpoint[]>>();

  for (const d of arr) {
    const dt = DateTime.fromJSDate(new Date(d.date));
    const year = dt.year;
    const week = dt.weekNumber;
    const day = dt.weekday;

    const yearMap = calendar.get(year);

    if (yearMap === undefined) {
      calendar.set(year, new Map());
    }

    const weekMap = calendar.get(year)!.get(week);

    if (weekMap === undefined) {
      calendar.get(year)!.set(week, []);
    }

    calendar.get(year)!.get(week)![day - 1] = d;
  }

  const weeks = [];

  for (const v of calendar.values()) {
    for (const v2 of v.values()) {
      weeks.push(v2);
    }
  }
  return weeks;
}
