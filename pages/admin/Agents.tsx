import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useCMS, AgentEntry } from "@/store/cms";
import { Plus, Search, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function Agents() {
  const navigate = useNavigate();
  const { agents, properties, addAgent } = useCMS();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<AgentEntry | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      agents.filter(
        (a) =>
          a.name.toLowerCase().includes(q.toLowerCase()) ||
          a.email.toLowerCase().includes(q.toLowerCase()) ||
          a.phone.toLowerCase().includes(q.toLowerCase())
      ),
    [agents, q]
  );

  const blank = (): AgentEntry => ({
    id: "agent-" + Date.now(),
    name: "", phone: "", email: "", bio: "",
    createdAt: new Date().toISOString(),
  });

  const openNew = () => { setEditing(blank()); setOpen(true); };

  const save = () => {
    if (!editing) return;
    if (!editing.name || !editing.email) return toast.error("Name and email are required");
    addAgent(editing);
    toast.success("Agent added");
    setOpen(false);
  };

  const initials = (n: string) =>
    n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  const propertyCount = (agentId: string) =>
    properties.filter((p) => (p.agentIds ?? (p.agentId ? [p.agentId] : [])).includes(agentId)).length;

  return (
    <>
      <PageHeader
        eyebrow="Directory"
        title="Agents"
        subtitle="All saved agents and the properties they handle. Click a row for full details."
        actions={
          <>
            <div className="relative w-44 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents" className="pl-9 h-9 rounded-xl" />
            </div>
            <Button onClick={openNew} size="sm" className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 shadow-gold">
              <Plus className="h-4 w-4 mr-1" /> New Agent
            </Button>
          </>
        }
      />

      <Card className="rounded-2xl shadow-card border-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3.5">Agent</th>
                <th className="text-left px-4 py-3.5 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Phone</th>
                <th className="text-right px-4 py-3.5">Listings</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No agents found.</td></tr>
              )}
              {filtered.map((a, i) => (
                <tr
                  key={a.id}
                  onClick={() => navigate(`/app/agents/${a.id}`)}
                  className="border-t border-border hover:bg-secondary/40 cursor-pointer transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-deep font-semibold flex items-center justify-center text-xs">
                        {initials(a.name)}
                      </div>
                      <div className="font-medium">{a.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell text-muted-foreground">{a.email}</td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-muted-foreground">{a.phone}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Badge variant="secondary" className="rounded-md">{propertyCount(a.id)}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>New agent</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Field label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="rounded-xl" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="rounded-xl" /></Field>
                <Field label="Email"><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="rounded-xl" /></Field>
              </div>
              <Field label="Bio"><Textarea value={editing.bio ?? ""} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} className="rounded-xl" /></Field>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={save} className="rounded-xl bg-primary text-primary-foreground shadow-gold">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
