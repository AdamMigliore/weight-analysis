import { StringIndex } from "@/interfaces/StringIndex";
import { TimestampedData } from "@/interfaces/TimestampedData";
import { isObjectEmpty } from "./isObjectEmpty";
import { transformDataToWeekArray } from "./transformDataToWeekArray";

export function findMedianOfAWeek(
  data: TimestampedData[],
  key: string,
  identifier: string
) {
  const medians: StringIndex[] = [];
  const weekArray = transformDataToWeekArray(data);
  for (const week of weekArray) {
    const median = getMedian(
      key,
      identifier,
      week.map((v) => ({ ...v, date: v.date.toISOString().split("T")[0] }))
    );
    medians.push(median);
  }

  return medians;
}

function getMedian(
  key: string,
  identifier: string,
  window: StringIndex[]
): StringIndex {
  const sortedWindow: StringIndex[] = window
    .map((v) => ({ [identifier]: v[identifier], [key]: v[key] }))
    .filter((v) => !isObjectEmpty(v))
    .sort((a, b) => a[key] - b[key]);

  const midpoint = Math.floor(sortedWindow.length / 2);
  if (sortedWindow.length % 2 == 0) {
    // Even
    return {
      [identifier]: sortedWindow[midpoint][identifier],
      [`median${key}`]:
        (sortedWindow[midpoint - 1][key] + sortedWindow[midpoint][key]) / 2,
    };
  } else {
    // Odd
    return {
      [identifier]: sortedWindow[midpoint][identifier],
      [`median${key}`]: sortedWindow[midpoint][key],
    };
  }
}
