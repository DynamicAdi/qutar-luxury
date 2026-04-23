"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Property, PropertyCategory } from "@/store/cms";
import { ArrowLeft, Loader, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Overview from "@/misc/properties/tabs/Overview";
import AgentsTab from "@/misc/properties/tabs/Agents";
import Amenities from "@/misc/properties/tabs/Amenities";
import Location from "@/misc/properties/tabs/Location";
import placeholderImg from "@/assets/property-2.jpg";
import Media from "@/misc/properties/tabs/Media";
import axios from "axios";

const blank = (id: string, category: PropertyCategory): Property => ({
  id,
  title: "",
  category,
  price: 0,
  currency: "QAR",
  address: "",
  city: "Doha",
  state: "Qatar",
  description: "",
  bedrooms: 3,
  bathrooms: 3,
  area: 2000,
  yearBuilt: new Date().getFullYear(),
  furnishing: "Unfurnished",
  parking: 1,
  images: [placeholderImg.src],
  amenities: [],
  features: [],
  nearby: [],
  documents: [],
  agent: { name: "", phone: "", email: "" },
  hidden: false,
  status: "Available",
  createdAt: new Date().toISOString(),
});

export default function PropertyEdit({
  search,
  id,
}: Readonly<{
  search: any;
  id: string;
}>) {
  const navigate = useRouter();
  const existing = id !== "new" ? true : false;

  const [p, setP] = useState<Property>(blank(id, search));
  const [thread, startThread] = useTransition()

  const saveNewProperty = () => startThread(async () => {
    const req = await axios.post("/api/properties", {
      title: p.title,
      description: p.description,
      images: p.images,
      youtubeLink: p.videoTourUrl,
      amenities: p.amenities,
      features: p.features,
      category: p.category.toUpperCase(),
      status: p.status.toUpperCase(),
      price: p.price,
      Area: p.area,
      NearByLocations: p.nearby,
      BedRooms: p.bedrooms,
      Bathrooms: p.bathrooms,
      parking: p.parking,
      furnishing: p.furnishing,
      HoaFees: p.hoaFee,
      yearBuilt: p.yearBuilt,
      addressId: p.addressId,
      agentIds: p.agentIds,
    })

    if (req.status === 200) {
    navigate.push(`/dashboard/properties/${search}`);
      toast.success("Added successfully!")
    }
    else {
      alert("Got some error")
    }

  })

  const upd = <K extends keyof Property>(k: K, v: Property[K]) =>
    setP((s) => ({ ...s, [k]: v }));

  const save = () => {
type PropertyKeys = keyof Property;

const requiredFields: PropertyKeys[] = [
  "title",
  "description",
  "images",
  "amenities",
  "features",
  "category",
  "price",
  "area",
  "addressId"
];

for (const key of requiredFields) {
  const value = p[key];

  if (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0)
  ) {
    alert(`${key} is not provided`);
    return
  }
}
    saveNewProperty()
    toast.success(existing ? "Property updated" : "Property created");
  };

  return (
    <>
      <PageHeader
        eyebrow={existing ? "Edit Property" : "New Property"}
        title={p.title || "Untitled Property"}
        subtitle={`${p.category} · ${p.city}, ${p.state}`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => navigate.back()}
              className="rounded-xl"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back
            </Button>
            <Button
              onClick={save}
              className="rounded-xl bg-gradient-gold text-primary-foreground shadow-gold"
            >
              {
                thread ? <Loader className="animate-spin" /> :
                <div className="flex gap-2 justify-center items-center">
              <Save className="h-4 w-4" /> Save
                </div>
              }
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: tabs of editable sections */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className="rounded-xl bg-secondary p-1 h-auto flex-wrap">
              {["overview", "media", "amenities", "location", "agent"].map(
                (t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="rounded-lg capitalize data-[state=active]:bg-card data-[state=active]:shadow-card px-3.5 py-1.5 text-xs sm:text-sm"
                  >
                    {t}
                  </TabsTrigger>
                ),
              )}
            </TabsList>

            <TabsContent value="overview">
              <Overview upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="media">
              <Media upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="amenities">
              <Amenities upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="location">
              <Location upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="agent">
              <AgentsTab update={upd} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview + visibility */}
        <div className="space-y-4">
          <Card className="rounded-2xl shadow-card border-0 overflow-hidden">
            <img
              src={p.images[0]}
              alt=""
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-md">
                  {p.category}
                </Badge>
                {p.status === "Sold" && (
                  <Badge className="bg-success text-success-foreground rounded-md">
                    Sold
                  </Badge>
                )}
                {p.hidden && (
                  <Badge variant="outline" className="rounded-md">
                    Hidden
                  </Badge>
                )}
              </div>
              <div className="font-grotesk font-semibold">
                {p.title || "Untitled"}
              </div>
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
                <div className="text-xs text-muted-foreground">
                  Toggle to hide/unhide listing
                </div>
              </div>
              <Switch
                checked={!p.hidden}
                onCheckedChange={(v) => upd("hidden", !v)}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
