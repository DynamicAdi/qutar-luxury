"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, Property, AgentEntry } from "@/store/cms";
import { ArrowLeft, BadgeCheck, Building2, Mail, Phone, Trash2, Bed, Bath, Maximize2, MapPin, ExternalLink, Pencil, LucideEdit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import axios from "axios";
import LoaderScreen from "@/misc/LoaderScreen";
import AgentDialog from "@/misc/AgentDialog";
import { PropertyCard } from "@/misc/properties/PropertiesCard";

export default function AgentDetail({id}: {id: string}) {

  const navigate = useRouter();
  const [data, setData] = useState<AgentEntry>();
  const [transition, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [loading, startLoading] = useTransition();
  const [editing, setEditing] = useState<AgentEntry | null>(null);

  const fetchAddress = () =>
    startTransition(async () => {
      const res = await axios.get(`/api/agent?id=${id}`);
      if (res.status === 200) {
        console.log(res.data.data);
        setData(res.data.data);
      }
    });

  const deleteAgent = (id: string) => {startTransition(async () => {
      const req = await axios.delete(`/api/agent?id=${id}`);
      if (req.status === 200) {
        toast.success("Address deleted");
        navigate.back();
      } else {
        toast.error("Failed to delete address");
      }
    });
  }

  useEffect(() => {
    fetchAddress();
  }, []);

  if (transition) {
    return (
      <LoaderScreen />
    );
  }
  if (!data) {
    return (
      <Card className="rounded-2xl p-12 text-center shadow-card border-0">
        <div className="text-muted-foreground mb-4">Address not found.</div>
        <Button
          onClick={() => navigate.back()}
          variant="outline"
          className="rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to addresses
        </Button>
      </Card>
    );
  }

  const remove = () => {
    if (data.properties.length > 0)
      return toast.error(
        `Linked to ${data.properties.length} propert${data.properties.length === 1 ? "y" : "ies"}`,
      );
    deleteAgent(data.id);
    toast.success("Agent deleted");
    navigate.push("/dashboard/agents");
  };

  const askToRemove = () => {
    const ask = confirm(
      `Are you sure you want to delete this address? This action cannot be undone.`,
    );
    if (ask) {
      remove();
    }
  };

  const openEdit = () => {
    setEditing(data);
    setOpen(true);
  };

  const saveEdit = () => {
    startLoading(async () => {
    const res = await axios.put(`/api/agent`, {
      id,
      bio: editing?.bio || data.bio,
      name: editing?.name || data.name,
      email: editing?.email || data.email,
      phone: editing?.phone || data.phone,
      });

      if (res.status === 200) {
        toast.success("Address updated");
        setData({ ...data, ...editing });
        setEditing(null);
        setOpen(false);
      }
    });
  };


  if (!data) {
    return (
      <Card className="rounded-2xl p-12 text-center shadow-card border-0">
        <div className="text-muted-foreground mb-4">Agent not found.</div>
        <Button onClick={() => navigate.back()} variant="outline" className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to agents
        </Button>
      </Card>
    );
  }

  const initials = data.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  return (
    <>
      <Card className="rounded-2xl p-2 shadow-card border-0 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate.back()} className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All agents
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <BadgeCheck className="h-4 w-4 text-primary" /> {data.name}
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
            <Badge variant="secondary" className="rounded-md">{data.properties.length}</Badge>
          </div>

          {data.properties.length === 0 ? (
            <div className="rounded-2xl p-12 border-0 text-center py-4">
              <p className="text-muted-foreground">No properties assigned to this agent yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {data.properties.map((p, i) => (
                <PropertyCard
                onDelete={() => {}}
                onToggleHide={() => {}}
                  key={p.id}
                  property={p}
                  index={i}
                  onView={() => navigate.push(`/dashboard/properties/${p.id}/edit`)}
                  onEdit={() => navigate.push(`/dashboard/properties/${p.id}/edit`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 20% — agent details (transparent panel) */}
        <aside className="lg:col-span-1 h-fit space-y-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/60 p-5">
            <div className="flex flex-col items-center text-center relative">
              <div className="h-16 w-16 rounded-2xl bg-primary/15 text-primary-deep font-grotesk font-semibold flex items-center justify-center text-xl">
                {initials}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-3">Agent</div>
                            <div
                className="mb-4 cursor-pointer text-primary hover:text-gradient-gold absolute right-0 top-0"
                onClick={openEdit}
              >
                <LucideEdit size={14} />
              </div>
              <h2 className="font-grotesk text-lg font-semibold mt-0.5">{data.name}</h2>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2 text-muted-foreground">
                <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span className="break-all">{data.email}</span>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-primary" />
                <span>{data.phone}</span>
              </div>
              {data.bio && (
                <div className="pt-3 border-t border-border text-muted-foreground text-xs leading-relaxed">{data.bio}</div>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={askToRemove} className="mt-4 w-full rounded-xl text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </aside>
      </div>

      <AgentDialog 
      editing={editing}
      open={open}
      loading={loading}
      save={saveEdit}
      setOpen={setOpen}
      setEditing={setEditing}
      />
    </>
  );
}
