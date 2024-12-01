import { NavigateFunction } from "react-router-dom";

let navigateFn: NavigateFunction;

export function setNavigate(navigate: NavigateFunction) {
  navigateFn = navigate;
}

export function navigateTo(path: string) {
  if (navigateFn) {
    navigateFn(path);
  } else {
    console.error("Navigate function is not set!");
  }
}
