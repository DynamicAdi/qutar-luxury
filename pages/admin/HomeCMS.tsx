import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCMS } from "@/store/cms";
import { Save, Star } from "lucide-react";
import { toast } from "sonner";

export default function HomeCMS() {
  const { home, updateHome, properties } = useCMS();

  const toggleFeatured = (id: string) => {
    const isF = home.featuredPropertyIds.includes(id);
    updateHome({
      featuredPropertyIds: isF
        ? home.featuredPropertyIds.filter((x) => x !== id)
        : [...home.featuredPropertyIds, id],
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Website CMS" title="Home Page Content"
        subtitle="Update the public-facing home page sections in real time."
        actions={<Button onClick={() => toast.success("Home page saved")} className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold"><Save className="h-4 w-4 mr-1.5" /> Save</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
          <div className="font-grotesk font-semibold">Hero Section</div>
          <div><Label>Hero Title</Label><Input className="rounded-xl mt-1" value={home.heroTitle} onChange={(e) => updateHome({ heroTitle: e.target.value })} /></div>
          <div><Label>Hero Subtitle</Label><Textarea className="rounded-xl mt-1" value={home.heroSubtitle} onChange={(e) => updateHome({ heroSubtitle: e.target.value })} /></div>
          <div><Label>CTA Button Text</Label><Input className="rounded-xl mt-1" value={home.heroCtaText} onChange={(e) => updateHome({ heroCtaText: e.target.value })} /></div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
          <div className="font-grotesk font-semibold">About Section</div>
          <div><Label>Title</Label><Input className="rounded-xl mt-1" value={home.aboutTitle} onChange={(e) => updateHome({ aboutTitle: e.target.value })} /></div>
          <div><Label>Body</Label><Textarea className="rounded-xl mt-1 min-h-32" value={home.aboutBody} onChange={(e) => updateHome({ aboutBody: e.target.value })} /></div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
          <div className="font-grotesk font-semibold">Contact</div>
          <div><Label>Email</Label><Input type="email" className="rounded-xl mt-1" value={home.contactEmail} onChange={(e) => updateHome({ contactEmail: e.target.value })} /></div>
          <div><Label>Phone</Label><Input className="rounded-xl mt-1" value={home.contactPhone} onChange={(e) => updateHome({ contactPhone: e.target.value })} /></div>
        </Card>

        <Card className="rounded-2xl p-5 shadow-card border-0">
          <div className="font-grotesk font-semibold mb-1">Featured Properties</div>
          <div className="text-xs text-muted-foreground mb-3">Click to toggle on the home page.</div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {properties.map((p) => {
              const featured = home.featuredPropertyIds.includes(p.id);
              return (
                <button key={p.id} onClick={() => toggleFeatured(p.id)}
                  className={`w-full flex items-center gap-3 rounded-xl border p-2 text-left transition-colors ${featured ? "border-primary bg-gold-soft" : "border-border hover:border-primary/40"}`}>
                  <img src={p.images[0]} alt="" className="h-10 w-14 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.category}</div>
                  </div>
                  {featured && <Badge className="bg-gradient-gold text-primary-foreground rounded-md gap-1"><Star className="h-3 w-3 fill-current" /> Featured</Badge>}
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
