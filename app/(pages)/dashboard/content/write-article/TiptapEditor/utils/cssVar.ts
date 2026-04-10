// biome-ignore lint/suspicious/noExplicitAny: value type from CSS
export const cssVar = (name: string, value: any) => {
  document.documentElement.style.setProperty(name, value);
};
