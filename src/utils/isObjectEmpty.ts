export function isObjectEmpty(o: any) {
  return (
    o &&
    Object.keys(o).length === 0 &&
    Object.getPrototypeOf(o) === Object.prototype
  );
}
