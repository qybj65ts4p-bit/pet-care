"use client";

import { FormEvent, useState } from "react";
import { SectionHeader } from "@/components/SectionHeader";

const contacts = [
  ["址", "门店地址", "武汉市友谊大道徐东路152号"],
  ["电", "预约电话", "400-800-2026"],
  ["微", "微信咨询", "RongZhua-PetSpa"],
  ["停", "停车与到店", "商场地下停车场可停 2 小时，携宠建议从东门宠物通道进入。"],
];

const fields =
  "mt-2 w-full rounded-2xl border border-ink/10 bg-white/85 px-4 py-3 text-ink outline-none transition placeholder:text-muted/55 focus:border-brand focus:ring-4 focus:ring-brand/15";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
    window.setTimeout(() => setSubmitted(false), 3200);
  }

  return (
    <section id="contact" className="py-14">
      <div className="mx-auto w-[min(calc(100%-40px),1180px)]">
        <SectionHeader
          chip="Booking"
          title="预约一场更安心的洗护"
          description="填写预约信息后，我们会根据宠物类型、服务项目和期望时间帮你安排合适档期。"
        />
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[28px] border border-white/60 bg-white/80 p-8 shadow-soft">
            <h3 className="mb-3 text-xl font-extrabold">到店信息</h3>
            <p className="leading-8 text-muted">
              首次预约建议提前说明宠物品种、年龄、毛发状态和是否怕吹风，我们会帮你安排更合适的洗护节奏。
            </p>
            <div className="mt-6 grid gap-5">
              {contacts.map(([icon, title, text]) => (
                <div
                  key={title}
                  className="flex gap-4 border-b border-ink/10 pb-5 last:border-0 last:pb-0"
                >
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

            <div className="mt-8 rounded-3xl bg-gradient-to-br from-brand/15 to-sage/15 p-6">
              <strong className="mb-2 block">预约提示</strong>
              <p className="m-0 leading-8 text-muted">
                高峰日建议提前 1 至 2 天预约；如宠物近期有皮肤问题或打疫苗，请在备注里一并说明。
              </p>
            </div>
          </article>

          <form
            onSubmit={handleSubmit}
            className="rounded-[34px] border border-brandDeep/15 bg-white/85 p-8 shadow-soft"
          >
            <div className="mb-6">
              <h3 className="mb-2 text-2xl font-black">客户预约表单</h3>
              <p className="m-0 leading-7 text-muted">
                提交后页面会先记录你的预约意向，正式确认仍以门店电话或微信回复为准。
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block font-bold">
                主人姓名
                <input className={fields} name="ownerName" placeholder="例如：张女士" required />
              </label>
              <label className="block font-bold">
                联系电话
                <input
                  className={fields}
                  name="phone"
                  type="tel"
                  placeholder="请输入手机号"
                  required
                />
              </label>
              <label className="block font-bold">
                宠物类型
                <select className={fields} name="petType" defaultValue="" required>
                  <option value="" disabled>
                    请选择宠物类型
                  </option>
                  <option>小型犬</option>
                  <option>中大型犬</option>
                  <option>猫咪</option>
                  <option>其他宠物</option>
                </select>
              </label>
              <label className="block font-bold">
                服务项目
                <select className={fields} name="service" defaultValue="" required>
                  <option value="" disabled>
                    请选择服务项目
                  </option>
                  <option>基础洗护</option>
                  <option>绒感深护套餐</option>
                  <option>高级造型套餐</option>
                  <option>猫咪安抚护理</option>
                </select>
              </label>
              <label className="block font-bold">
                预约日期
                <input className={fields} name="date" type="date" required />
              </label>
              <label className="block font-bold">
                期望时段
                <select className={fields} name="timeSlot" defaultValue="" required>
                  <option value="" disabled>
                    请选择到店时段
                  </option>
                  <option>10:00 - 12:00</option>
                  <option>12:00 - 14:00</option>
                  <option>14:00 - 17:00</option>
                  <option>17:00 - 20:00</option>
                </select>
              </label>
              <label className="block font-bold md:col-span-2">
                宠物情况备注
                <textarea
                  className={`${fields} min-h-32 resize-y`}
                  name="note"
                  placeholder="例如：泰迪，2 岁，毛发轻微打结，比较怕吹风。"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-gradient-to-r from-brand to-brandDeep px-6 font-extrabold text-white shadow-[0_18px_34px_rgba(199,100,54,0.22)] transition hover:-translate-y-0.5"
              >
                提交预约
              </button>
              <a
                href="tel:4008002026"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink/10 bg-white/75 px-6 font-extrabold text-ink shadow-[0_14px_28px_rgba(29,42,47,0.08)] transition hover:-translate-y-0.5"
              >
                电话预约
              </a>
              {submitted && (
                <span className="font-bold text-brandDeep">
                  已收到预约意向，我们会尽快联系你确认档期。
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
