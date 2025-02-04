export const extend = Object.assign;

export const isObject = (obj) => obj !== null && typeof obj === 'object';
export const isFunction = (obj) => typeof obj === 'function';
export const isString = (obj) => typeof obj === 'string';

export { ShapeFlags } from './shapeFlags';

export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key);

export const toUpperFirstChar = (string) => `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const toDisplayString = (val) => String(val);