import type { ButtonHTMLAttributes } from 'react';

const variants = {
  cream: 'club-button club-cream',
  red: 'club-button club-red',
  mustard: 'club-button club-mustard',
  paper: 'club-button club-paper',
  pill: 'club-pill',
  day: 'day-button',
  follow: 'follow-button',
} as const;

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0';

export type ButtonVariant = keyof typeof variants;

/** Class names for a button-styled element, usable on <a> too. */
export function buttonClass(variant: ButtonVariant, extra = ''): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

export function Button({ variant, className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant: ButtonVariant }) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}
