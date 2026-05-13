"use client";

import { useState } from "react";

const navItems = [
  ["服务项目", "#services"],
  ["套餐价格", "#pricing"],
  ["护理流程", "#process"],
  ["用户评价", "#reviews"],
  ["到店预约", "#contact"],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/45 bg-[#fff8f0]/80 backdrop-blur">
      <div className="mx-auto flex min-h-[78px] w-[min(calc(100%-40px),1180px)] items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-3 font-extrabold text-ink">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#edb17a] to-brandDeep text-lg text-white shadow-[0_14px_28px_rgba(199,100,54,0.18)]">
            P
          </span>
          <span>
            绒爪洗护
            <small className="mt-1 block text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Pet Spa & Grooming
            </small>
          </span>
        </a>

        <button
          type="button"
          aria-label="打开导航"
          aria-expanded={open}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/80 shadow-soft lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 rounded-full bg-ink transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-ink transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-4 h-0.5 w-5 rounded-full bg-ink transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        <nav
          className={`absolute left-5 right-5 top-[calc(100%+8px)] grid gap-3 rounded-3xl border border-white/80 bg-[#fff8f0]/95 p-5 text-muted shadow-soft transition lg:static lg:flex lg:translate-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0 lg:visible lg:opacity-100"
          }`}
        >
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-medium transition hover:text-ink"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
