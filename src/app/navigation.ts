type Navigator = (path: string) => void;

let navigator: Navigator | null = null;

export function registerNavigator(next: Navigator | null): void {
  navigator = next;
}

export function navigateTo(path: string): void {
  if (navigator) {
    navigator(path);
  } else {
    window.history.pushState(null, '', path);
  }
}
