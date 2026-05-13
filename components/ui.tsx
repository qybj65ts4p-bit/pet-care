import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

const base =
  "inline-flex min-h-[52px] items-center justify-center rounded-full px-6 font-extrabold transition hover:-translate-y-0.5";
const variants = {
  primary:
    "bg-gradient-to-r from-brand to-brandDeep text-white shadow-[0_18px_34px_rgba(199,100,54,0.22)]",
  secondary:
    "border border-ink/10 bg-white/75 text-ink shadow-[0_14px_28px_rgba(29,42,47,0.08)]",
};

export function ButtonLink({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
