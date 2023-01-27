type StringIndex = { [index: string]: any };

export function findMedian<T>(
  data: StringIndex[],
  key: string,
  medianWindow: number,
  identifier: string
): StringIndex[] {
  // Assume data is sorted
  const medians: StringIndex[] = [];
  for (let i = 0; i < data.length; i += medianWindow) {
    const window = data.slice(i, i + medianWindow);
    const median = getMedian(key, identifier, window);
    medians.push(median);
  }
  return medians;
}

function getMedian(
  key: string,
  identifier: string,
  window: StringIndex[]
): StringIndex {
  const midpoint = Math.floor(window.length / 2);
  const sortedWindow: StringIndex[] = window
    .map((v) => ({ [identifier]: v[identifier], [key]: v[key] }))
    .sort((a, b) => a[key] - b[key]);
  if (window.length % 2 == 0) {
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
