type SectionHeaderProps = {
  chip: string;
  title: string;
  description: string;
};

export function SectionHeader({ chip, title, description }: SectionHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.12em] text-brandDeep">
          {chip}
        </span>
        <h2 className="m-0 max-w-3xl text-4xl font-black leading-tight text-ink md:text-5xl">
          {title}
        </h2>
      </div>
      <p className="m-0 max-w-2xl text-base leading-8 text-muted">{description}</p>
    </div>
  );
}
