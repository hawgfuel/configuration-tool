export type Enum<E> = Record<keyof E, number | string> & { [k: number]: string };

export const enumKeyToString = <E extends Enum<E>>(s: keyof E) => (s as string)
  .replace(/([a-z](?=[A-Z]))/g, '$1 ');

export const mapEnumToOptions = <E extends Enum<E>>(e: E) => Object.keys(e)
  // Remove the unknown option, if it is present
  .filter((s) => s !== 'Unknown')
  // Set label to separate camel cased values
  .map((s) => ({
    label: enumKeyToString(s),
    value: s,
  }));
