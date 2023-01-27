interface StringIndex {
  [index: string]: any;
}

export function merge(a: StringIndex[], b: StringIndex[], key: string) {
  const map: StringIndex = {};

  a.forEach((v) => (map[v[key]] = { ...map[v[key]], ...v }));
  b.forEach((v) => (map[v[key]] = { ...map[v[key]], ...v }));

  return Object.values(map);
}
