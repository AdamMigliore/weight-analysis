import Healthpoint from "@/interfaces/Healthpoint";
import { DateTime } from "luxon";

function findMaintenanceCalories(data: Healthpoint[], debug: boolean = false) {
  // Step 1: Create a dataset of [median 1, ..., median 2] shape
  const medianWeeks: Healthpoint[][] = transformToMedianArray(data);

  const maintenanceCaloriesOverWeeks: number[] = [];
  const averageCaloriesLoggedOverWeeks: number[] = [];

  for (const medianWindow of medianWeeks) {
    const filteredMedianWindow = medianWindow
      .slice(1)
      .filter((d) => !Number.isNaN(d.calories));
    const lastIndex = medianWindow.length - 1;

    // Step 1: Get days in between median
    const median1Dt = DateTime.fromISO(medianWindow[0].date);
    const median2Dt = DateTime.fromISO(medianWindow[lastIndex].date);
    const daysBetween = median2Dt.diff(median1Dt, "days").days;

    // Step 2: Get total calories over that week
    // * We count calories for the window where food was eaten to achieve the weight difference (so all days minus the first day of the window)
    const caloriesLoggedOverWeek = filteredMedianWindow.reduce(
      (prev, curr) => prev + curr.calories,
      0
    );

    // * the number of days logged is equal to the length of the array - first day (the first median is the calories from the day before)
    const averageCaloriesLoggedOverWeek =
      caloriesLoggedOverWeek / filteredMedianWindow.length;

    const totalCaloriesConsumedOverWeek =
      averageCaloriesLoggedOverWeek * daysBetween;

    // Step 3: Get caloric difference over week
    // * By convention, each medianWindow will start and end with a median
    const caloricDifference =
      (medianWindow[lastIndex].medianWeight! - medianWindow[0].medianWeight!) *
      3500;

    // Step 4: Get maintenance calories for that week
    const maintenanceCalories =
      (totalCaloriesConsumedOverWeek - caloricDifference) / daysBetween;

    averageCaloriesLoggedOverWeeks.push(averageCaloriesLoggedOverWeek);
    maintenanceCaloriesOverWeeks.push(maintenanceCalories);

    if (debug) {
      console.log("caloriesLoggedOverWeek", caloriesLoggedOverWeek);
      console.log(
        "averageCaloriesLoggedOverWeek",
        averageCaloriesLoggedOverWeek
      );
      console.log(
        "totalCaloriesConsumedOverWeek",
        totalCaloriesConsumedOverWeek
      );
      console.log("caloricDifference", caloricDifference);
      console.log("maintenanceCalories", maintenanceCalories);
      console.log();
    }
  }

  // Step 5: return
  return {
    maintenanceCaloriesOverWeeks: maintenanceCaloriesOverWeeks.map((v) =>
      Math.round(v)
    ),
    averageCaloriesLoggedOverWeeks: averageCaloriesLoggedOverWeeks.map((v) =>
      Math.round(v)
    ),
  };
}

function transformToMedianArray(
  data: Healthpoint[],
  excludeExtremes: boolean = true
) {
  let foundMedians = 0;
  const medianWeeks: { [index: number]: Healthpoint[] } = {};
  for (const d of data) {
    if (d.medianWeight == undefined) {
      if (!medianWeeks[foundMedians]) {
        medianWeeks[foundMedians] = [];
      }
      medianWeeks[foundMedians] = [...medianWeeks[foundMedians], d];
    } else if (d.medianWeight != undefined) {
      if (!medianWeeks[foundMedians]) {
        medianWeeks[foundMedians] = [];
        medianWeeks[foundMedians + 1] = [];
      }

      medianWeeks[foundMedians] = [...medianWeeks[foundMedians], d]; // previous week
      foundMedians = foundMedians + 1;
      medianWeeks[foundMedians] = [d]; // new week
    }
  }
  return excludeExtremes
    ? Object.values(medianWeeks).slice(2, -1)
    : Object.values(medianWeeks).slice(1); // We restrict to a window that is for sure complete (excluding last week and excluding the first week)
}

export { findMaintenanceCalories };
