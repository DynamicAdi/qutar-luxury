import logo from "@/assets/qlp-logo.png";

interface Props {
  showText?: boolean;
  className?: string;
}
export const Logo = ({ showText = true, className = "" }: Props) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <img src={logo.src} alt="QLP" className="h-9 w-9 object-contain drop-shadow" width={36} height={36} />
    {showText && (
      <div className="leading-none">
        <div className="font-grotesk text-base font-semibold tracking-[0.2em] text-gold-gradient">QLP</div>
        <div className="text-[9px] uppercase tracking-[0.25em] text-white/60">Qutar Luxury</div>
      </div>
    )}
  </div>
);
