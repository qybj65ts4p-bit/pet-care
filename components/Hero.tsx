import Image from "next/image";
import { ButtonLink } from "@/components/ui";

const points = [
  ["低敏产品", "精选温和洗护配方，适合敏感肌宠物日常清洁。"],
  ["分区洗护", "猫狗动线分开，减少陌生环境造成的紧张反应。"],
  ["过程可视", "护理步骤透明可沟通，接送前后状态一目了然。"],
];

export function Hero() {
  return (
    <section id="home" className="py-8 md:py-12">
      <div className="mx-auto grid w-[min(calc(100%-40px),1180px)] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="py-8">
          <span className="inline-flex items-center rounded-full border border-brandDeep/15 bg-white/75 px-4 py-2 font-bold text-brandDeep shadow-[0_8px_18px_rgba(199,100,54,0.08)]">
            城市宠物精致洗护体验
          </span>
          <h1 className="my-5 max-w-3xl text-5xl font-black leading-none text-ink md:text-7xl">
            把洗澡这件小事，做成宠物最安心的一次放松。
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted">
            绒爪洗护为猫咪和狗狗提供温和清洁、毛发梳理、皮肤护理与造型修剪。我们关注的不只是“洗干净”，更是让每一次到店都舒适、稳定、值得信赖。
          </p>
          <div className="my-8 flex flex-wrap gap-4">
            <ButtonLink href="#contact">立即预约洗护</ButtonLink>
            <ButtonLink href="#pricing" variant="secondary">
              查看套餐价格
            </ButtonLink>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {points.map(([title, text]) => (
              <article
                key={title}
                className="rounded-3xl border border-white/60 bg-white/75 p-5 shadow-soft"
              >
                <strong className="mb-2 block text-lg">{title}</strong>
                <span className="text-sm leading-6 text-muted">{text}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[500px] overflow-hidden rounded-[34px] border border-white/65 bg-[#e6ded0] shadow-warm md:min-h-[640px]">
          <Image
            src="/assets/hero-grooming-photo.png"
            alt="店内美容师正在为宠物进行洗护"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-ink/45" />
          <div className="absolute left-5 top-5 max-w-[330px] rounded-2xl bg-white/90 p-5 shadow-soft backdrop-blur md:left-7 md:top-8">
            <strong className="block text-lg">一宠一护</strong>
            <small className="text-muted">洗护工具独立消毒，护理记录全程留档。</small>
          </div>
          <div className="absolute bottom-8 right-5 max-w-[340px] rounded-2xl bg-white/90 p-5 shadow-soft backdrop-blur md:right-7">
            <strong className="block text-lg">真实店内洗护场景</strong>
            <small className="text-muted">温和清洁、轻声安抚，让宠物在专业环境里完成护理。</small>
          </div>
        </div>
      </div>
    </section>
  );
}
