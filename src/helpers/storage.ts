export const save = (key: string, value: any) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const get = (key: string): any => {
  const result = window.localStorage.getItem(key);
  if (!result) {
    return {};
  }
  return JSON.parse(result);
};

export default { save, get };
