export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export function replaceKeys(obj: any, keyMapping: { [key: string]: string }): any {
  if (obj instanceof Array) {
    return obj.map((val) => replaceKeys(val, keyMapping));
  }
  if (obj && typeof obj === 'object') {
    const items = Object.keys(obj).map((key) => {
      const newKey = keyMapping[key] || key;
      return { [newKey]: replaceKeys(obj[key], keyMapping) };
    });
    return (items.length > 0) ? items.reduce((a, b) => ({ ...a, ...b })) : {};
  }
  return obj;
}

export function convertToMonthYearFormat(date: Date): string {
  try {
    const month = date.getUTCMonth() + 1;
    return `${date.getUTCFullYear()}-${month / 10 >= 1 ? month : `0${month}`}`;
  } catch (e) {
    return date.toDateString();
  }
}

export const getUTCDate = (date: Date): string => (
  `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
);

// convert boolean types to strings in form field
export const mapSurveyTypes = (d:boolean) => {
  const radioStringValue = d === true ? 'yes' : 'no';
  return radioStringValue;
};
  // convert strings types back to boolean
export const reverseSurveyTypes = (d:string) => {
  const radioBooleanValue = d === 'yes';
  return radioBooleanValue;
};
