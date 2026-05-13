"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const slides = [
  {
    src: "/assets/store-lobby.png",
    alt: "高端宠物洗护店前厅接待区",
    title: "前厅接待区",
    text: "暖米色与浅石材搭配，入口视觉干净克制，让主人进店第一眼就能感受到轻奢、温和和专业感。",
  },
  {
    src: "/assets/store-bathing.png",
    alt: "高端宠物洗护店专业洗护区",
    title: "专业洗护区",
    text: "独立洗护池、整洁台面与柔和照明共同构成核心工作区，强调卫生标准与高端护理体验。",
  },
  {
    src: "/assets/store-lounge.png",
    alt: "高端宠物洗护店休息等候区",
    title: "休息等候区",
    text: "结合精品陈列与休闲座位，保留门店温度，也让等待时间变得更从容、更有品质感。",
  },
];

export function StoreGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 4800);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="environment" className="py-14 pt-8">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Store Tour"
          title="店内环境一览"
          description="网页最下方补上一组店内环境轮播图，分别展示前厅接待区、专业洗护区和休息等候区，整体风格偏中国城市高端宠物洗护门店。"
        />
        <div className="overflow-hidden rounded-[36px] border border-white/70 bg-white/80 shadow-soft">
          <div className="relative aspect-video min-h-[260px] bg-[#d9d2c7] md:min-h-[320px]">
            {slides.map((slide, index) => (
              <article
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === active ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" sizes="(min-width: 1180px) 1180px, 100vw" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-6 text-[#fff8ef] md:p-8">
                  <h3 className="mb-3 text-2xl font-black">{slide.title}</h3>
                  <p className="m-0 max-w-2xl leading-8 text-[#fff8ef]/85">{slide.text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="上一张"
                className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft transition hover:-translate-y-0.5"
                onClick={() => setActive((value) => (value - 1 + slides.length) % slides.length)}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="下一张"
                className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft transition hover:-translate-y-0.5"
                onClick={() => setActive((value) => (value + 1) % slides.length)}
              >
                ›
              </button>
            </div>
            <div className="flex gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`查看第 ${index + 1} 张`}
                  className={`h-3 w-3 rounded-full transition ${
                    index === active ? "scale-125 bg-brand" : "bg-ink/20"
                  }`}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <div className="text-sm text-muted">共 3 张环境图，支持自动轮播与手动切换。</div>
          </div>
        </div>
      </div>
    </section>
  );
}
