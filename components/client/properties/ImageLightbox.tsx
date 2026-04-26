import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  images: string[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
}

const ImageLightbox = ({ images, startIndex, open, onClose }: Props) => {
  const [idx, setIdx] = useState(startIndex);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (open) { setIdx(startIndex); setZoom(1); }
  }, [open, startIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-emerald-deep/95 backdrop-blur-md flex items-center justify-center animate-fade-in">
      <button onClick={onClose} className="absolute top-4 right-4 size-12 rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground flex items-center justify-center">
        <X className="size-6" />
      </button>
      <div className="absolute top-4 left-4 flex gap-2">
        <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="size-12 rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground flex items-center justify-center">
          <ZoomIn className="size-5" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(1, z - 0.25))} className="size-12 rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground flex items-center justify-center">
          <ZoomOut className="size-5" />
        </button>
      </div>

      <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-4 size-14 rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground flex items-center justify-center">
        <ChevronLeft className="size-7" />
      </button>
      <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-4 size-14 rounded-full bg-background/10 hover:bg-background/20 text-primary-foreground flex items-center justify-center">
        <ChevronRight className="size-7" />
      </button>

      <div className="overflow-auto max-h-[90vh] max-w-[90vw]">
        <img
          src={images[idx]}
          alt={`Image ${idx + 1}`}
          style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
          className="max-h-[90vh] object-contain transition-transform"
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-display tracking-widest text-primary-foreground text-sm">
        {idx + 1} / {images.length}
      </div>
    </div>
  );
};

export default ImageLightbox;
