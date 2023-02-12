import Healthpoint from "@/interfaces/Healthpoint";
import { isObjectEmpty } from "./isObjectEmpty";
import { transformDataToWeekArray } from "./transformDataToWeekArray";

export function findMedians(data: Healthpoint[]) {
  const weekArray = transformDataToWeekArray(data);
  for (const week of weekArray) {
    getMedian(week);
  }
  const flattened = weekArray.flat();
  return flattened;
}

function getMedian(window: Healthpoint[]) {
  const sortedWindow: Healthpoint[] = window
    .filter((v) => !isObjectEmpty(v))
    .sort((a, b) => a.date.localeCompare(b.date));

  const midpoint = Math.floor(sortedWindow.length / 2);
  if (sortedWindow.length % 2 == 0) {
    // Even
    sortedWindow[midpoint].medianWeight =
      (sortedWindow[midpoint - 1].weight + sortedWindow[midpoint].weight) / 2;
  } else {
    // Odd
    sortedWindow[midpoint].medianWeight = sortedWindow[midpoint].weight;
  }
}
