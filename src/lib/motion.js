/**
 * Shared Framer Motion tokens so animated UI (dropdowns, list items, modals,
 * buttons) moves with one consistent feel instead of per-file guesses.
 */

export const EASE_OUT = [0.16, 1, 0.3, 1];

export const dropdownVariants = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
};

export const dropdownTransition = { duration: 0.16, ease: EASE_OUT };

// Opens sideways off the trigger button instead of dropping below it, so it
// never reads as the row/card growing taller.
export const sideDropdownVariants = {
  initial: { opacity: 0, x: 6, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 6, scale: 0.98 },
};

export const listItemVariants = {
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.12 } },
};

export const listItemTransition = { duration: 0.18, ease: EASE_OUT };

export const gridItemVariants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.12 } },
};

export const gridItemTransition = { duration: 0.2, ease: EASE_OUT };

export const tapScale = { scale: 0.96 };
export const hoverLift = { y: -1 };
