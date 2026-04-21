import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCMS, Property, PropertyCategory, AddressEntry, AgentEntry } from "@/store/cms";
import { ArrowLeft, Save, Plus, X, Image as ImageIcon, MapPin, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import placeholderImg from "@/assets/property-2.jpg";

const blank = (id: string, category: PropertyCategory): Property => ({
  id, title: "", category, price: 0, currency: "QAR",
  address: "", city: "Doha", country: "Qatar",
  description: "", bedrooms: 3, bathrooms: 3, area: 2000, yearBuilt: new Date().getFullYear(),
  furnishing: "Unfurnished", parking: 1, images: [placeholderImg],
  amenities: [], features: [], nearby: [], documents: [],
  agent: { name: "", phone: "", email: "" },
  hidden: false, status: "Available", createdAt: new Date().toISOString(),
});

export default function PropertyEdit() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { properties, upsertProperty, addresses, agents, addAddress, addAgent } = useCMS();
  const initialCategory = (search.get("category") as PropertyCategory) || "Residential";
  const existing = useMemo(() => properties.find((p) => p.id === id), [properties, id]);
  const [p, setP] = useState<Property>(existing ?? blank(id || "p" + Date.now(), initialCategory));

  useEffect(() => { if (existing) setP(existing); }, [existing]);

  const upd = <K extends keyof Property>(k: K, v: Property[K]) => setP((s) => ({ ...s, [k]: v }));
  const updAgent = (k: keyof Property["agent"], v: string) => setP((s) => ({ ...s, agent: { ...s.agent, [k]: v } }));

  const save = () => {
    if (!p.title) return toast.error("Title is required");
    upsertProperty(p);
    toast.success(existing ? "Property updated" : "Property created");
    navigate("/app/properties");
  };

  const onPickAddress = (a: AddressEntry) => {
    setP((s) => ({
      ...s,
      addressId: a.id,
      address: a.address,
      city: a.city,
      country: a.country,
      lat: a.lat,
      lng: a.lng,
    }));
  };

  const toggleAgent = (g: AgentEntry) => {
    setP((s) => {
      const current = s.agentIds ?? (s.agentId ? [s.agentId] : []);
      const has = current.includes(g.id);
      const next = has ? current.filter((id) => id !== g.id) : [...current, g.id];
      // keep legacy single agent in sync with first selected
      const first = next[0];
      const firstAgent = first ? agents.find((a) => a.id === first) : undefined;
      return {
        ...s,
        agentIds: next,
        agentId: first,
        agent: firstAgent
          ? { name: firstAgent.name, phone: firstAgent.phone, email: firstAgent.email, avatar: firstAgent.avatar }
          : { name: "", phone: "", email: "" },
      };
    });
  };

  const addAndSelectAgent = (g: AgentEntry) => {
    addAgent(g);
    setP((s) => {
      const current = s.agentIds ?? (s.agentId ? [s.agentId] : []);
      const next = current.includes(g.id) ? current : [...current, g.id];
      return {
        ...s,
        agentIds: next,
        agentId: next[0],
        agent: next[0] === g.id
          ? { name: g.name, phone: g.phone, email: g.email, avatar: g.avatar }
          : s.agent,
      };
    });
  };

  return (
    <>
      <PageHeader
        eyebrow={existing ? "Edit Property" : "New Property"}
        title={p.title || "Untitled Property"}
        subtitle={`${p.category} · ${p.city}, ${p.country}`}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate(-1)} className="rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            <Button onClick={save} className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold">
              <Save className="h-4 w-4 mr-1.5" /> Save
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: tabs of editable sections */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className="rounded-xl bg-secondary p-1 h-auto flex-wrap">
              {["overview", "media", "amenities", "location", "agent", "enquire"].map((t) => (
                <TabsTrigger key={t} value={t} className="rounded-lg capitalize data-[state=active]:bg-card data-[state=active]:shadow-card px-3.5 py-1.5 text-xs sm:text-sm">
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview">
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <Field label="Title">
                  <Input value={p.title} onChange={(e) => upd("title", e.target.value)} className="rounded-xl" placeholder="Pearl Marina Signature Villa" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Category">
                    <Select value={p.category} onValueChange={(v) => upd("category", v as PropertyCategory)}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["Buy","Sell","Rent","Plots","Residential"] as PropertyCategory[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Status">
                    <Select value={p.status} onValueChange={(v) => upd("status", v as Property["status"])}>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Available","Reserved","Sold"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <Field label="Description">
                  <Textarea value={p.description} onChange={(e) => upd("description", e.target.value)} className="rounded-xl min-h-32" />
                </Field>

                {/* Common: price + area */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Field label={p.category === "Rent" ? "Rent (QAR)" : "Price (QAR)"}>
                    <Input type="number" value={p.price} onChange={(e) => upd("price", +e.target.value)} className="rounded-xl" />
                  </Field>
                  <Field label={p.category === "Plots" ? "Land Area (sqft)" : "Built-up Area (sqft)"}>
                    <Input type="number" value={p.area} onChange={(e) => upd("area", +e.target.value)} className="rounded-xl" />
                  </Field>
                  {p.category === "Plots" && (
                    <Field label="Plot Area (sqm)">
                      <Input type="number" value={p.plotArea || 0} onChange={(e) => upd("plotArea", +e.target.value)} className="rounded-xl" />
                    </Field>
                  )}
                </div>

                {/* Building fields — hidden for Plots */}
                {p.category !== "Plots" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Bedrooms">
                      <Input type="number" value={p.bedrooms} onChange={(e) => upd("bedrooms", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Bathrooms">
                      <Input type="number" value={p.bathrooms} onChange={(e) => upd("bathrooms", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Year Built">
                      <Input type="number" value={p.yearBuilt} onChange={(e) => upd("yearBuilt", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Parking">
                      <Input type="number" value={p.parking} onChange={(e) => upd("parking", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Furnishing">
                      <Select value={p.furnishing} onValueChange={(v) => upd("furnishing", v as Property["furnishing"])}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Furnished","Semi-Furnished","Unfurnished"].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    {p.category !== "Rent" && (
                      <Field label="HOA Fee (QAR/mo)">
                        <Input type="number" value={p.hoaFee || 0} onChange={(e) => upd("hoaFee", +e.target.value)} className="rounded-xl" />
                      </Field>
                    )}
                  </div>
                )}

                {/* Plot-specific */}
                {p.category === "Plots" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Zoning">
                      <Select value={p.zoning || "Residential"} onValueChange={(v) => upd("zoning", v as Property["zoning"])}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Residential","Commercial","Mixed-Use","Industrial","Agricultural"].map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Road Access">
                      <Select value={p.roadAccess || "Paved"} onValueChange={(v) => upd("roadAccess", v as Property["roadAccess"])}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Paved","Unpaved","Highway-adjacent","None"].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Utilities Ready">
                      <Select value={p.utilitiesReady ? "Yes" : "No"} onValueChange={(v) => upd("utilitiesReady", v === "Yes")}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Yes","No"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Corner Plot">
                      <Select value={p.cornerPlot ? "Yes" : "No"} onValueChange={(v) => upd("cornerPlot", v === "Yes")}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Yes","No"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                  </div>
                )}

                {/* Rent-specific */}
                {p.category === "Rent" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <Field label="Rent Period">
                      <Select value={p.rentPeriod || "Monthly"} onValueChange={(v) => upd("rentPeriod", v as Property["rentPeriod"])}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["Monthly","Yearly"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Min Lease (months)">
                      <Input type="number" value={p.minLeaseMonths || 0} onChange={(e) => upd("minLeaseMonths", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Deposit (months)">
                      <Input type="number" value={p.depositMonths || 0} onChange={(e) => upd("depositMonths", +e.target.value)} className="rounded-xl" />
                    </Field>
                    <Field label="Available From">
                      <Input type="date" value={p.availableFrom || ""} onChange={(e) => upd("availableFrom", e.target.value)} className="rounded-xl" />
                    </Field>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <div>
                  <Label className="mb-2 block">Image Gallery</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {p.images.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video">
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <button
                          onClick={() => upd("images", p.images.filter((_, idx) => idx !== i))}
                          className="absolute top-2 right-2 rounded-full bg-card/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => upd("images", [...p.images, placeholderImg])}
                      className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 mb-1" />
                      <span className="text-xs">Add image</span>
                    </button>
                  </div>
                </div>
                <Field label="Video Tour URL">
                  <Input value={p.videoTourUrl || ""} onChange={(e) => upd("videoTourUrl", e.target.value)} className="rounded-xl" placeholder="https://youtube.com/..." />
                </Field>
                <Field label="Virtual Tour URL (Matterport)">
                  <Input value={p.virtualTourUrl || ""} onChange={(e) => upd("virtualTourUrl", e.target.value)} className="rounded-xl" />
                </Field>
                <Field label="Floor Plan URL">
                  <Input value={p.floorPlanUrl || ""} onChange={(e) => upd("floorPlanUrl", e.target.value)} className="rounded-xl" />
                </Field>
              </Card>
            </TabsContent>

            <TabsContent value="amenities">
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <ChipEditor label="Amenities" items={p.amenities} onChange={(v) => upd("amenities", v)}
                  suggestions={["Private Pool","Gym","Spa","Sauna","Smart Home","Home Cinema","Wine Cellar","Concierge","Maid Quarters","Driver Quarters","Kids Area","Tennis Court"]} />
                <ChipEditor label="Features" items={p.features} onChange={(v) => upd("features", v)}
                  suggestions={["Sea View","Skyline View","Marina Access","Private Elevator","Italian Marble","Solar Roof","Pet Friendly","Smart Lighting"]} />
              </Card>
            </TabsContent>

            <TabsContent value="location">
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <AddressPicker
                  addresses={addresses}
                  selectedId={p.addressId}
                  onPick={onPickAddress}
                  onCreate={(a) => { addAddress(a); onPickAddress(a); }}
                  preview={{ address: p.address, city: p.city, country: p.country, lat: p.lat, lng: p.lng }}
                />
                <div className="pt-4 border-t border-border">
                  <Label className="block">Nearby Landmarks</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">
                    These are saved on this property only — not on the saved Address.
                  </p>
                  <div className="space-y-2">
                    {p.nearby.map((n, i) => (
                      <div key={i} className="grid grid-cols-12 gap-2">
                        <Input className="rounded-xl col-span-5" placeholder="Name" value={n.name}
                          onChange={(e) => upd("nearby", p.nearby.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} />
                        <Input className="rounded-xl col-span-4" placeholder="Type" value={n.type}
                          onChange={(e) => upd("nearby", p.nearby.map((x, idx) => idx === i ? { ...x, type: e.target.value } : x))} />
                        <Input className="rounded-xl col-span-2" type="number" placeholder="km" value={n.distanceKm}
                          onChange={(e) => upd("nearby", p.nearby.map((x, idx) => idx === i ? { ...x, distanceKm: +e.target.value } : x))} />
                        <button onClick={() => upd("nearby", p.nearby.filter((_, idx) => idx !== i))} className="col-span-1 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                          <X className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => upd("nearby", [...p.nearby, { name: "", type: "", distanceKm: 0 }])} className="rounded-xl">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Add nearby
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="agent">
              <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <AgentPicker
                  agents={agents}
                  selectedIds={p.agentIds ?? (p.agentId ? [p.agentId] : [])}
                  onToggle={toggleAgent}
                  onCreate={addAndSelectAgent}
                />
              </Card>
            </TabsContent>

            <TabsContent value="enquire">
              <EnquiriesList propertyId={p.id} propertyTitle={p.title || "this property"} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview + visibility */}
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-card border-0 overflow-hidden">
            <img src={p.images[0]} alt="" className="h-44 w-full object-cover" loading="lazy" />
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md">{p.category}</Badge>
                {p.status === "Sold" && <Badge className="bg-success text-success-foreground rounded-md">Sold</Badge>}
                {p.hidden && <Badge variant="outline" className="rounded-md">Hidden</Badge>}
              </div>
              <div className="font-grotesk font-semibold">{p.title || "Untitled"}</div>
              <div className="text-xs text-muted-foreground">{p.address}</div>
              <div className="text-lg font-grotesk text-gold-gradient font-semibold">
                {p.currency} {p.price.toLocaleString()}
              </div>
            </div>
          </Card>
          <Card className="rounded-2xl p-4 shadow-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">Visibility on website</div>
                <div className="text-xs text-muted-foreground">Toggle to hide/unhide listing</div>
              </div>
              <Switch checked={!p.hidden} onCheckedChange={(v) => upd("hidden", !v)} />
            </div>
          </Card>
        </div>
      </div>
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

function ChipEditor({ label, items, onChange, suggestions }: {
  label: string; items: string[]; onChange: (v: string[]) => void; suggestions: string[];
}) {
  const [v, setV] = useState("");
  const add = (val: string) => { if (val && !items.includes(val)) onChange([...items, val]); setV(""); };
  return (
    <div>
      <Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {items.map((i) => (
          <Badge key={i} variant="secondary" className="rounded-md gap-1 pr-1">
            {i}
            <button onClick={() => onChange(items.filter((x) => x !== i))} className="rounded hover:bg-foreground/10 p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add(v))}
          placeholder={`Add ${label.toLowerCase()}`} className="rounded-xl" />
        <Button onClick={() => add(v)} variant="outline" className="rounded-xl">Add</Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {suggestions.filter((s) => !items.includes(s)).map((s) => (
          <button key={s} onClick={() => add(s)} className="text-[11px] rounded-full bg-secondary hover:bg-gold-soft px-2 py-1 text-muted-foreground hover:text-primary-deep transition-colors">
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}


function EnquiriesList({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const { leads, properties, updateLead } = useCMS();
  const navigate = useNavigate();
  const propertyExists = properties.some((p) => p.id === propertyId);
  const items = leads.filter((l) => l.propertyId === propertyId);

  const statusStyle: Record<string, string> = {
    New: "bg-primary/10 text-primary-deep border-primary/30",
    Contacted: "bg-warning/15 text-[hsl(35_60%_30%)] border-warning/30",
    Qualified: "bg-success/15 text-[hsl(142_55%_28%)] border-success/30",
    Converted: "bg-primary text-primary-foreground border-transparent",
    Lost: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Card className="rounded-2xl p-5 shadow-card border-0">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="font-grotesk font-semibold">Enquiries for {propertyTitle}</div>
          <div className="text-xs text-muted-foreground">Leads submitted from the website for this property.</div>
        </div>
        <Badge variant="secondary" className="rounded-md shrink-0">{items.length}</Badge>
      </div>

      {!propertyExists ? (
        <div className="py-10 text-center text-sm text-muted-foreground">Save this property first to start receiving enquiries.</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">No enquiries yet for this property.</div>
      ) : (
        <div className="space-y-2">
          {items.map((l, i) => (
            <div
              key={l.id}
              className="rounded-xl border border-border/60 p-3 hover:bg-secondary/30 transition-colors animate-fade-in-up"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-deep flex items-center justify-center text-xs font-semibold shrink-0">
                  {l.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-medium">{l.name}</div>
                    <span className={`text-[10px] uppercase tracking-wider rounded-md border px-1.5 py-0.5 ${statusStyle[l.status]}`}>{l.status}</span>
                    <Badge variant="outline" className="rounded-md font-normal border-primary/30 text-primary-deep text-[10px]">{l.budget}</Badge>
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                    <a href={`mailto:${l.email}`} className="hover:text-primary">{l.email}</a>
                    <a href={`tel:${l.phone}`} className="hover:text-primary">{l.phone}</a>
                  </div>
                  {l.message && <p className="mt-2 text-sm text-muted-foreground">{l.message}</p>}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Select value={l.status} onValueChange={(v) => updateLead(l.id, { status: v as typeof l.status })}>
                    <SelectTrigger className="h-7 w-28 rounded-lg text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["New","Contacted","Qualified","Converted","Lost"] as const).map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-right">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/leads")} className="rounded-xl text-xs">
          Manage all leads →
        </Button>
      </div>
    </Card>
  );
}

function AddressPicker({
  addresses, selectedId, onPick, onCreate, preview,
}: {
  addresses: AddressEntry[];
  selectedId?: string;
  onPick: (a: AddressEntry) => void;
  onCreate: (a: AddressEntry) => void;
  preview: { address: string; city: string; country: string; lat?: number; lng?: number };
}) {
  const [mode, setMode] = useState<"select" | "new">("select");
  const [draft, setDraft] = useState<AddressEntry>({
    id: "addr-" + Date.now(),
    label: "", address: "", city: "Doha", country: "Qatar",
    createdAt: new Date().toISOString(),
  });

  const handleSelect = (val: string) => {
    if (val === "__new__") {
      setDraft({
        id: "addr-" + Date.now(),
        label: "", address: "", city: "Doha", country: "Qatar",
        createdAt: new Date().toISOString(),
      });
      setMode("new");
    } else {
      const a = addresses.find((x) => x.id === val);
      if (a) { onPick(a); setMode("select"); }
    }
  };

  const saveNew = () => {
    if (!draft.label || !draft.address) return toast.error("Label and address required");
    onCreate(draft);
    setMode("select");
    toast.success("Address saved & selected");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Saved Address</Label>
      </div>
      <Select value={mode === "new" ? "__new__" : selectedId ?? ""} onValueChange={handleSelect}>
        <SelectTrigger className="rounded-xl">
          <SelectValue placeholder="Select an address…" />
        </SelectTrigger>
        <SelectContent>
          {addresses.map((a) => (
            <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>
          ))}
          <SelectItem value="__new__" className="text-primary-deep font-medium">+ Add new address</SelectItem>
        </SelectContent>
      </Select>

      {mode === "new" ? (
        <Card className="rounded-xl p-4 border border-primary/30 bg-gold-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm flex items-center gap-1.5"><Plus className="h-3.5 w-3.5 text-primary" /> New address</div>
            <button onClick={() => setMode("select")} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          <Field label="Label"><Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} className="rounded-xl bg-card" placeholder="Pearl Marina, Doha" /></Field>
          <Field label="Street Address"><Input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} className="rounded-xl bg-card" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City"><Input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className="rounded-xl bg-card" /></Field>
            <Field label="Country"><Input value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} className="rounded-xl bg-card" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude"><Input type="number" value={draft.lat ?? ""} onChange={(e) => setDraft({ ...draft, lat: e.target.value ? +e.target.value : undefined })} className="rounded-xl bg-card" /></Field>
            <Field label="Longitude"><Input type="number" value={draft.lng ?? ""} onChange={(e) => setDraft({ ...draft, lng: e.target.value ? +e.target.value : undefined })} className="rounded-xl bg-card" /></Field>
          </div>
          <Button onClick={saveNew} size="sm" className="rounded-xl bg-primary text-primary-foreground shadow-gold">
            <Plus className="h-4 w-4 mr-1" /> Save & Select
          </Button>
        </Card>
      ) : (
        <Card className="rounded-xl p-4 bg-secondary/40 border-0 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Preview (read-only)</div>
          {selectedId ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <PreviewItem label="Address">{preview.address || "—"}</PreviewItem>
              <PreviewItem label="City">{preview.city || "—"}</PreviewItem>
              <PreviewItem label="Country">{preview.country || "—"}</PreviewItem>
              {preview.lat != null && <PreviewItem label="Lat">{preview.lat}</PreviewItem>}
              {preview.lng != null && <PreviewItem label="Lng">{preview.lng}</PreviewItem>}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No address selected. Pick one above or add a new one.</div>
          )}
        </Card>
      )}
    </div>
  );
}

function AgentPicker({
  agents, selectedIds, onToggle, onCreate,
}: {
  agents: AgentEntry[];
  selectedIds: string[];
  onToggle: (g: AgentEntry) => void;
  onCreate: (g: AgentEntry) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedQuery, setSelectedQuery] = useState("");
  const [draft, setDraft] = useState<AgentEntry>({
    id: "agent-" + Date.now(),
    name: "", phone: "", email: "",
    createdAt: new Date().toISOString(),
  });

  const startAdd = () => {
    setDraft({
      id: "agent-" + Date.now(),
      name: "", phone: "", email: "",
      createdAt: new Date().toISOString(),
    });
    setAdding(true);
    setPickerOpen(false);
  };

  const saveNew = () => {
    if (!draft.name || !draft.email) return toast.error("Name and email required");
    onCreate(draft);
    setAdding(false);
    toast.success("Agent saved & selected");
  };

  const selectedAgents = selectedIds
    .map((id) => agents.find((a) => a.id === id))
    .filter((a): a is AgentEntry => Boolean(a));

  const initials = (n: string) =>
    n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");

  const filteredSelected = selectedAgents.filter((g) =>
    g.name.toLowerCase().includes(selectedQuery.toLowerCase()) ||
    g.email.toLowerCase().includes(selectedQuery.toLowerCase())
  );

  const filteredAvailable = agents.filter((g) => {
    if (selectedIds.includes(g.id)) return false;
    const q = query.toLowerCase();
    return !q || g.name.toLowerCase().includes(q) || g.email.toLowerCase().includes(q) || g.phone.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BadgeCheck className="h-4 w-4 text-primary" />
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Assigned Agents</Label>
          <Badge variant="secondary" className="rounded-md text-[10px]">{selectedIds.length}</Badge>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPickerOpen((o) => !o)} variant="outline" size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5 mr-1" /> {pickerOpen ? "Close" : "Add agent"}
          </Button>
          <Button onClick={startAdd} variant="outline" size="sm" className="rounded-xl">
            <Plus className="h-3.5 w-3.5 mr-1" /> New
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
          {filteredSelected.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-gold-soft/40">
              <div className="h-9 w-9 rounded-full bg-primary/15 text-primary-deep font-semibold flex items-center justify-center text-xs">
                {initials(g.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{g.name}</div>
                <div className="text-xs text-muted-foreground truncate">{g.email} · {g.phone}</div>
              </div>
              <button
                onClick={() => onToggle(g)}
                className="rounded-lg p-1.5 hover:bg-destructive/10 hover:text-destructive transition-colors"
                aria-label={`Remove ${g.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {filteredSelected.length === 0 && (
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
            {filteredAvailable.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {agents.length === 0 ? "No agents yet — create one." : "No matching agents."}
              </div>
            ) : (
              filteredAvailable.map((g) => (
                <button
                  key={g.id}
                  onClick={() => { onToggle(g); setQuery(""); }}
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

      {adding && (
        <Card className="rounded-xl p-4 border border-primary/30 bg-gold-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium text-sm flex items-center gap-1.5"><Plus className="h-3.5 w-3.5 text-primary" /> New agent</div>
            <button onClick={() => setAdding(false)} className="text-xs text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
          <Field label="Name"><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="rounded-xl bg-card" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Phone"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="rounded-xl bg-card" /></Field>
            <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="rounded-xl bg-card" /></Field>
          </div>
          <Button onClick={saveNew} size="sm" className="rounded-xl bg-primary text-primary-foreground shadow-gold">
            <Plus className="h-4 w-4 mr-1" /> Save & Select
          </Button>
        </Card>
      )}
    </div>
  );
}

function PreviewItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium">{children}</div>
    </div>
  );
}
