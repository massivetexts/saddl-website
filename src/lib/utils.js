export function decode(str) {
  return decodeURIComponent(str).replaceAll("====", "/");
}

export const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));
