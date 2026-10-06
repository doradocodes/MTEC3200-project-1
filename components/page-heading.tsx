export function PageHeading({ dateLabel }: { dateLabel: string }) {
  return (
    <section
      className="flex min-h-34 items-center justify-between gap-5 pt-3 pb-2 max-[760px]:min-h-29"
      aria-labelledby="today-heading"
    >
      <div>
        <p className="mb-1 text-xs font-medium text-[#748780]">
          {dateLabel}
        </p>
        <h1
          className="m-0 text-[clamp(30px,4vw,38px)] font-medium leading-[1.05] tracking-[-0.055em] text-[#183b3a]"
          id="today-heading"
        >
          Today
        </h1>
      </div>
    </section>
  );
}