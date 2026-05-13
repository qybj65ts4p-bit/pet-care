import { SectionHeader } from "@/components/SectionHeader";
import { ButtonLink } from "@/components/ui";

const reviews = [
  ["猫咪终于不再抗拒洗澡", "我家布偶以前去别家总是很紧张，这次店员会提前安抚，也会讲解每个步骤，回来以后状态很轻松，毛也特别顺。", "周小姐 · 两只猫家庭"],
  ["修得干净但不过分夸张", "比起花哨造型，我更喜欢这种自然耐看的修剪风格，耳朵、脸和脚边都很利落，回家也好打理。", "李先生 · 比熊主人"],
  ["护理细节很加分", "店里会记录皮肤泛红和打结的位置，还会提醒我下次梳毛要注意哪里，感觉不是流水线洗澡，真的很用心。", "陈女士 · 金毛主人"],
  ["预约节奏舒服", "没有把很多宠物挤在同一时间段，等待时间短，进店后就开始护理，对胆子小的狗狗真的特别友好。", "王小姐 · 柯基主人"],
];

export function Reviews() {
  return (
    <section id="reviews" className="py-14">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Reviews"
          title="被宠物和主人一起喜欢的洗护体验"
          description="真实回头客最在意的，不只是洗得干净，而是宠物下次还愿意进门。"
        />
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {reviews.map(([title, text, name]) => (
              <article key={title} className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-soft">
                <div className="mb-4 text-brand">★★★★★</div>
                <h3 className="mb-3 text-xl font-extrabold">{title}</h3>
                <p className="leading-8 text-muted">{text}</p>
                <span className="mt-5 inline-flex items-center gap-3 font-extrabold before:block before:h-9 before:w-9 before:rounded-full before:bg-gradient-to-br before:from-brand/30 before:to-sage/30">
                  {name}
                </span>
              </article>
            ))}
          </div>
          <aside className="overflow-hidden rounded-[34px] bg-gradient-to-br from-[#293f39] to-[#446259] p-8 text-[#f6f2e9] shadow-[0_26px_54px_rgba(24,41,36,0.22)]">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-[#f4c59d]">
              Why Us
            </span>
            <h3 className="mb-3 text-3xl font-black leading-tight">
              我们把“洗护店”做得更像一间让宠物放心的小型护理室。
            </h3>
            <p className="leading-8 text-[#f6f2e9]/80">
              从香味浓度、吹风距离到预约节奏，我们都尽量降低宠物的陌生压力。主人也能通过清晰的沟通，知道这次护理真正改善了什么。
            </p>
            <div className="my-8 grid gap-4 sm:grid-cols-2">
              {[
                ["3000+", "累计服务宠物洗护次数"],
                ["4.9/5", "门店回访满意度"],
                ["1对1", "独立护理节奏安排"],
                ["7天", "常见毛发维护建议周期"],
              ].map(([value, label]) => (
                <div key={value} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                  <strong className="mb-2 block text-3xl">{value}</strong>
                  <span className="text-sm leading-6 text-[#f6f2e9]/75">{label}</span>
                </div>
              ))}
            </div>
            <ButtonLink href="#contact" variant="secondary">
              现在预约到店体验
            </ButtonLink>
          </aside>
        </div>
      </div>
    </section>
  );
}
