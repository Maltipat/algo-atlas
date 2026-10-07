export function CompanyMark({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  return <span className="grid shrink-0 place-items-center rounded-lg font-semibold text-white" style={{ width: size, height: size, background: color, fontSize: size * 0.42 }} aria-hidden>{name[0]}</span>;
}
