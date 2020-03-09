import _ from 'lodash';

export const keysToCamelCase = (obj: object) =>
  _.mapKeys(obj, (v, k) => _.camelCase(k));

export const keysToSnakeCase = (obj: object) =>
  _.mapKeys(obj, (v, k) => _.snakeCase(k));
