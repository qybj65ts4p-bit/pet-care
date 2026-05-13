import { SectionHeader } from "@/components/SectionHeader";

const services = [
  ["01", "基础洗护", "包含梳毛、清耳、修甲、温和洗浴与吹干整理，适合日常到店清洁与气味护理。"],
  ["02", "深层护理", "针对打结毛发、换毛期与皮肤敏感宠物，增加润护、毛结疏通与局部修整。"],
  ["03", "造型修剪", "根据宠物脸型与日常打理习惯做精修轮廓，清爽耐看，也便于居家维护。"],
  ["04", "猫咪安抚护理", "轻声安抚、缩短等待时间，采用更柔和节奏完成洗护，减少应激与抗拒。"],
];

export function Services() {
  return (
    <section id="services" className="py-14">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Services"
          title="围绕舒适感设计的洗护项目"
          description="从基础清洁到精修护理，每项服务都按照宠物体型、毛发长度和情绪状态灵活调整，让洗护过程更稳、更顺、更安心。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map(([number, title, text]) => (
            <article
              key={title}
              className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-soft backdrop-blur transition hover:-translate-y-1"
            >
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand/20 to-sage/20 font-black text-brandDeep">
                {number}
              </div>
              <h3 className="mb-3 text-xl font-extrabold">{title}</h3>
              <p className="m-0 leading-8 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
