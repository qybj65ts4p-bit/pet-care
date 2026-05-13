"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";
import { Button, ButtonLink } from "@/components/ui";

const address = "武汉市友谊大道徐东路152号";

export function LocationMap() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="location" className="py-14 pt-5">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Map"
          title="门店定位"
          description="下面这张地图已经按你发来的截图关系重新调整，门店位置对应你箭头指向的点位，并保留了可爱宠物店风格的视觉表达。"
        />
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="rounded-[34px] border border-white/65 bg-white/85 p-8 shadow-soft">
            <span className="mb-5 inline-flex min-h-9 items-center rounded-full bg-brand/15 px-4 font-extrabold text-brandDeep">
              宠物友好到店示意
            </span>
            <h3 className="mb-3 text-xl font-extrabold">绒爪洗护 · 武汉徐东店</h3>
            <p className="leading-8 text-muted">
              门店位于{address}，这次的示意图按照你发来的地图重新定位，门店点位落在箭头所指的中商徐东平价广场一侧区域。
            </p>
            <div className="my-6 rounded-3xl bg-gradient-to-br from-brand/15 to-sage/15 p-6">
              <strong className="mb-2 block text-lg">{address}</strong>
              <span className="leading-8 text-muted">
                导航时可直接搜索完整地址，也可以先到徐东立交与中商徐东平价广场附近，再按门头和招牌识别门店位置。
              </span>
            </div>
            <div className="grid gap-5">
              {[
                ["路", "主要道路", "地图重点保留了友谊大道、徐东路以及徐东立交的相对走向，让页面里的位置关系更接近你发来的原图。"],
                ["找", "找店方式", "建议先找到中商徐东平价广场，再看箭头指向的一侧街边位置，会比只看楼号更容易快速确认。"],
                ["宠", "温馨提示", "带宠到店时尽量避开高峰堵车时段，提前一点出发，宠物状态会更轻松一些。"],
              ].map(([icon, title, text]) => (
                <div key={title} className="flex gap-4 border-b border-ink/10 pb-5 last:border-0">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand/20 to-sage/20 font-black text-brandDeep">
                    {icon}
                  </div>
                  <div>
                    <strong className="mb-1 block">{title}</strong>
                    <span className="leading-7 text-muted">{text}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button type="button" onClick={copyAddress}>
                {copied ? "地址已复制" : "复制门店地址"}
              </Button>
              <ButtonLink href="#contact" variant="secondary">
                返回预约区域
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm leading-7 text-muted">
              提示：这是风格化到店示意图，重点用于页面展示与方向感传达，不替代专业导航地图。
            </p>
          </article>

          <aside className="rounded-[34px] border border-white/65 bg-white/85 p-6 shadow-soft">
            <h3 className="mb-3 text-xl font-extrabold">AI 绘制地图</h3>
            <p className="leading-8 text-muted">
              这版地图由 AI 按你提供的截图重新绘制，保留徐东片区的核心道路、商场和箭头定位关系，并做成更柔和的宠物店视觉。
            </p>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-white/65 bg-[#e7eef6]">
              <Image
                src="/assets/store-map-ai.png"
                alt="AI 绘制的武汉市友谊大道徐东路152号宠物店定位地图"
                width={1536}
                height={864}
                className="h-auto w-full"
                priority={false}
              />
            </div>
            <div className="flex flex-col gap-4 px-1 pt-5 md:flex-row md:items-center md:justify-between">
              <p className="m-0 leading-7 text-muted">
                红色箭头和爪印定位对应你截图里标出的门店位置，点位落在中商徐东平价广场一侧。
              </p>
              <span className="inline-flex min-h-9 shrink-0 items-center rounded-full bg-white/80 px-3 text-sm text-ink shadow-soft">
                AI 绘图地图
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
