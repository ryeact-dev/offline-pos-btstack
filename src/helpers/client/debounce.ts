import { debounce } from "@tanstack/react-pacer";

export function debouncer(fn: Function, delay: number) {
  return debounce(
    () => {
      fn();
    },
    { wait: delay },
  );
}
