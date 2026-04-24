import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AgentEntry, Property } from "@/store/cms";
import axios from "axios";
import { BadgeCheck, Plus, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function AgentPicker({p, update}: {p: Property, update: any}) {

  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [data, setData] = useState<AgentEntry[]>([]);
  const [transition, startTransition] = useTransition()
  const [selectedAgents, setSelectedAgent] = useState<AgentEntry[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

const removeAgentById = (id: string) => {
  setSelectedAgent(prev =>
    prev.filter(agent => agent.id !== id)
  );

  update(
    "agentIds",
    (p.agentIds ?? []).filter(agentId => agentId !== id)
  );
};

const addAgent = (agent: AgentEntry) => {
  setSelectedAgent([...selectedAgents, agent])
  setSelectedIds([...selectedIds, agent.id])
  update("agent", agent)
  update("agentIds", [...(p.agentIds ?? []), agent.id])
}

  const fetchData = () => {startTransition(async () => {
    const req = await axios.get("/api/agent");
    if (req.status === 200) {
        setData(req.data.data);
    }
  })}

  useEffect(() => {
    fetchData()
    if (p.agent.length) {
      setSelectedAgent(p.agent)
    }
  }, [])


  const initials = (n: string) =>
    n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

const filteredSelected = data.filter((g) =>
  (g.name.toLowerCase().includes(query.toLowerCase()) ||
   g.email.toLowerCase().includes(query.toLowerCase())) &&
  !selectedAgents.some(agent => agent.id === g.id)
);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Assigned Agents</Label>
          <Badge variant="secondary" className="rounded-md text-[10px]">{selectedAgents.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPickerOpen((o) => !o)} variant="outline" size="sm" className="rounded-xl">
            <Plus className={`h-3.5 w-3.5 mr-1 ${pickerOpen ? "rotate-45" : "rotate-0"}`} /> {pickerOpen ? "Close" : "Add agent"}
          </Button>
        </div>
      </div>

      {/* Search within selected */}
      {selectedAgents.length > 3 && (
        <div className="relative">
          <Input
            value={selectedQuery}
            onChange={(e) => setSelectedQuery(e.target.value)}
            placeholder="Search assigned agents…"
            className="rounded-xl pl-8 h-9"
          />
          <BadgeCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Selected list */}
      {selectedAgents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No agents assigned. Click <span className="font-medium text-foreground">Add agent</span> to pick from saved agents.
        </div>
      ) : (
        <div className="rounded-xl border border-border divide-y divide-border">
          {selectedAgents.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-gold-soft/40">
              <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-deep font-semibold flex items-center justify-center text-xs">
                {initials(g.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{g.name}</div>
                <div className="text-xs text-muted-foreground truncate">{g.email} · {g.phone}</div>
              </div>
              <button
                onClick={() => {removeAgentById(g.id)}}
                className="rounded-lg p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label={`Remove ${g.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {selectedAgents.length === 0 && (
            <div className="p-3 text-xs text-muted-foreground text-center">No matches in assigned agents.</div>
          )}
        </div>
      )}

      {/* Picker dropdown — only opens on demand */}
      {pickerOpen && (
        <Card className="rounded-xl p-3 border border-primary/30 space-y-2 shadow-card">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search agents to add…"
              className="rounded-xl pl-8 h-9"
              autoFocus
            />
            <BadgeCheck className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="rounded-xl border border-border divide-y divide-border max-h-64 overflow-auto">
            {filteredSelected.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {filteredSelected.length === 0 ? "No agents yet — create one." : "No matching agents."}
              </div>
            ) : (
              filteredSelected.map((g) => (
                <button
                  key={g.id}
                  onClick={() => addAgent(g)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-secondary/40 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/15 text-primary-deep font-semibold flex items-center justify-center text-xs">
                    {initials(g.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{g.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{g.email} · {g.phone}</div>
                  </div>
                  <Plus className="h-4 w-4 text-primary shrink-0" />
                </button>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}