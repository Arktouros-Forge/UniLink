export const focusFirstInvalid = () => {
  if (!import.meta.client) return;
  nextTick(() => {
    const target = document.querySelector("[aria-invalid='true']");
    if (!target) return;
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    target.focus?.({ preventScroll: true });
  });
};
