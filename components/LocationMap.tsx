"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";

export function LocationMap() {
  return (
    <section id="location" className="py-14 pt-5">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Map"
          title="门店定位"
          description="下面这张地图已经按你发来的截图关系重新调整，门店位置对应你箭头指向的点位，并保留了可爱宠物店风格的视觉表达。"
        />
        <div className="grid gap-5">
          <aside className="rounded-[34px] border border-white/65 bg-white/85 p-6 shadow-soft">
            <div className="overflow-hidden rounded-[28px] border border-white/65 bg-[#e7eef6]">
              <Image
                src="/assets/store-map-ai.png"
                alt="AI 绘制的武汉市友谊大道徐东路152号宠物店定位地图"
                width={1536}
                height={864}
                className="h-auto w-full"
                priority={false}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
