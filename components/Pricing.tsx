import { SectionHeader } from "@/components/SectionHeader";
import { ButtonLink } from "@/components/ui";

const packages = [
  {
    badge: "小体型日常洗护",
    title: "轻松焕新套餐",
    price: "¥128",
    description: "适合小型犬、短毛猫等日常清洁频率较高的宠物。",
    items: ["基础洗护与吹整", "耳部清洁与修甲", "足底与腹底简单修剪", "护理过程反馈建议"],
    featured: false,
  },
  {
    badge: "门店热选",
    title: "绒感深护套餐",
    price: "¥198",
    description: "适合长毛、换毛期或需要更细致整理的宠物，也是门店里最受欢迎的到店选择。",
    items: ["深层清洁与柔顺护理", "轻度毛结疏通", "面部与尾部精细整理", "基础皮毛状态评估"],
    featured: true,
  },
  {
    badge: "精修造型",
    title: "高级造型套餐",
    price: "¥268",
    description: "适合需要整体修毛、造型整理和拍照出片感的宠物。",
    items: ["全套洗护与深润护理", "全身精修造型", "局部细节修整", "造型维护建议"],
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-14">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Pricing"
          title="清晰透明的套餐价格"
          description="以下为常见体型参考价，具体费用会根据宠物毛量、打结程度和服务内容微调，到店前可先沟通估价。"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {packages.map((item) => (
            <article
              key={item.title}
              className={`rounded-[28px] border p-8 shadow-soft backdrop-blur ${
                item.featured
                  ? "border-brandDeep/20 bg-gradient-to-b from-white to-[#fff4e7]"
                  : "border-white/60 bg-white/80"
              }`}
            >
              <span className="mb-5 inline-flex min-h-8 items-center rounded-full bg-brand/15 px-3 text-sm font-bold text-brandDeep">
                {item.badge}
              </span>
              <h3 className="mb-3 text-xl font-extrabold">{item.title}</h3>
              <div className="my-4 text-5xl font-black leading-none">
                {item.price}
                <small className="ml-2 text-base font-bold text-muted">/次起</small>
              </div>
              <p className="leading-8 text-muted">{item.description}</p>
              <ul className="my-7 grid gap-3">
                {item.items.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-sage" />
                    {feature}
                  </li>
                ))}
              </ul>
              <ButtonLink href="#contact" variant={item.featured ? "primary" : "secondary"}>
                {item.featured ? "优先预约热选套餐" : "预约这项服务"}
              </ButtonLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
