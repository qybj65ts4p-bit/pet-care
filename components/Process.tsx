import { SectionHeader } from "@/components/SectionHeader";

const steps = [
  ["STEP 01", "到店评估", "查看毛发、皮肤、打结与情绪状态，确认今天更适合基础洗护还是加强护理。"],
  ["STEP 02", "分区准备", "根据猫狗属性与体型安排独立区域，减少噪音和陌生刺激，提高适应速度。"],
  ["STEP 03", "洗护护理", "使用温和洗剂完成清洁、吹整与毛发护理，中途根据反应及时放缓节奏。"],
  ["STEP 04", "离店反馈", "交接护理结果与后续建议，让主人了解皮毛状态、在家梳理重点和复约周期。"],
];

export function Process() {
  return (
    <section id="process" className="py-14">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Process"
          title="从接待到离店，每一步都温柔有序"
          description="我们希望主人知道宠物在店里经历了什么，也希望宠物知道这里是安全可预测的环境。"
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([index, title, text]) => (
            <article key={title} className="rounded-[28px] border border-white/60 bg-white/80 p-7 shadow-soft">
              <span className="mb-3 inline-block text-xs font-extrabold uppercase tracking-[0.14em] text-brandDeep">
                {index}
              </span>
              <h3 className="mb-3 text-lg font-extrabold">{title}</h3>
              <p className="m-0 leading-8 text-muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
