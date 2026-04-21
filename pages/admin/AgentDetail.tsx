import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCMS, formatPrice, Property } from "@/store/cms";
import { ArrowLeft, BadgeCheck, Building2, Mail, Phone, Trash2, Bed, Bath, Maximize2, MapPin, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agents, properties, deleteAgent } = useCMS();

  const agent = agents.find((a) => a.id === id);
  const linked = useMemo(
    () => (agent ? properties.filter((p) => (p.agentIds ?? (p.agentId ? [p.agentId] : [])).includes(agent.id)) : []),
    [agent, properties]
  );

  if (!agent) {
    return (
      <Card className="rounded-2xl p-12 text-center shadow-card border-0">
        <div className="text-muted-foreground mb-4">Agent not found.</div>
        <Button onClick={() => navigate("/app/agents")} variant="outline" className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to agents
        </Button>
      </Card>
    );
  }

  const initials = agent.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  const remove = () => {
    if (linked.length > 0) return toast.error(`Linked to ${linked.length} propert${linked.length === 1 ? "y" : "ies"}`);
    deleteAgent(agent.id);
    toast.success("Agent deleted");
    navigate("/app/agents");
  };

  return (
    <>
      <Card className="rounded-2xl p-2 shadow-card border-0 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/app/agents")} className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All agents
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <BadgeCheck className="h-4 w-4 text-primary" /> {agent.name}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left 80% — linked properties */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="font-grotesk font-semibold text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Properties handled
            </div>
            <Badge variant="secondary" className="rounded-md">{linked.length}</Badge>
          </div>

          {linked.length === 0 ? (
            <Card className="rounded-2xl p-12 shadow-card border-0 text-center">
              <p className="text-muted-foreground">No properties assigned to this agent yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {linked.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  index={i}
                  onView={() => navigate(`/app/properties/${p.id}/edit`)}
                  onEdit={() => navigate(`/app/properties/${p.id}/edit`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 20% — agent details (transparent panel) */}
        <aside className="lg:col-span-1 h-fit space-y-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/60 p-5">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 text-primary-deep font-grotesk font-semibold flex items-center justify-center text-xl">
                {initials}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3">Agent</div>
              <h2 className="font-grotesk text-lg font-semibold mt-0.5">{agent.name}</h2>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span className="break-all">{agent.email}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span>{agent.phone}</span>
              </div>
              {agent.bio && (
                <div className="pt-3 border-t border-border text-muted-foreground text-xs leading-relaxed">{agent.bio}</div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={remove} className="mt-4 w-full rounded-xl text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </aside>
      </div>
    </>
  );
}

function PropertyCard({
  property: p, index, onView, onEdit,
}: {
  property: Property; index: number; onView: () => void; onEdit: () => void;
}) {
  return (
    <Card
      className="group rounded-2xl border border-border/60 shadow-card overflow-hidden hover:shadow-luxury hover:-translate-y-0.5 transition-all duration-500 animate-fade-in-up bg-card flex flex-col"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <Badge className="bg-card/95 backdrop-blur text-foreground hover:bg-card/95 rounded-md border border-border/40 font-medium">
            {p.category}
          </Badge>
          {p.status === "Sold" && (
            <Badge className="bg-success text-success-foreground hover:bg-success rounded-md">Sold</Badge>
          )}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-grotesk font-semibold text-base leading-tight line-clamp-1">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{p.address}, {p.city}</span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-y border-border/60 py-2.5">
          {p.bedrooms > 0 && <span className="flex items-center gap-1.5"><Bed className="h-3.5 w-3.5 text-primary" /> {p.bedrooms}</span>}
          {p.bathrooms > 0 && <span className="flex items-center gap-1.5"><Bath className="h-3.5 w-3.5 text-primary" /> {p.bathrooms}</span>}
          <span className="flex items-center gap-1.5 ml-auto"><Maximize2 className="h-3.5 w-3.5 text-primary" /> {p.area.toLocaleString()} sqft</span>
        </div>
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Price</div>
          <div className="font-grotesk font-semibold text-lg text-primary-deep">
            {formatPrice(p.price, p.currency)}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={onView} size="sm" variant="outline" className="flex-1 rounded-xl border-primary/40 text-primary-deep hover:bg-gold-soft hover:text-primary-deep">
            <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> View
          </Button>
          <Button onClick={onEdit} size="sm" className="flex-1 rounded-xl bg-primary text-primary-foreground shadow-gold hover:opacity-90">
            <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}
