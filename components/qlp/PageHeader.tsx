import { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}
export const PageHeader = ({ eyebrow, title, subtitle, actions }: Props) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && (
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary-deep">
          {eyebrow}
        </div>
      )}
      <h1 className="font-grotesk text-2xl sm:text-3xl font-semibold tracking-tight">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);
