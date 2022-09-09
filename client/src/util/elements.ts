export function getScrollFromBottom(elem: HTMLElement): number {
  return elem.scrollHeight - elem.scrollTop - elem.clientHeight;
}

export function scrollToFromBottom(elem: HTMLElement, amount: number) {
  elem.scrollTop = elem.scrollHeight - elem.clientHeight - amount;
}
