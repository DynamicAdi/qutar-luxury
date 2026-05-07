"use client";

import { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/qlp/PageHeader";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Property, PropertyCategory } from "@/store/cms";
import { ArrowLeft, Loader, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Overview from "@/misc/properties/tabs/Overview";
import Documents from "@/misc/properties/tabs/Documents";
import AgentsTab from "@/misc/properties/tabs/Agents";
import Amenities from "@/misc/properties/tabs/Amenities";
import Location from "@/misc/properties/tabs/Location";
import placeholderImg from "@/assets/property-2.jpg";
import Media from "@/misc/properties/tabs/Media";
import axios from "axios";
import LoaderScreen from "@/misc/LoaderScreen";
import { uploadFile } from "@/lib/uploadImage";
import PersonalizedDocsTab from "@/misc/properties/tabs/PersonalizedDocs";

const blank = (id: string, category: PropertyCategory): Property => ({
  id,
  title: "",
  category: "BUY",
  price: 0,
  currency: "QAR",
  addressId: "",
  city: "Doha",
  state: "Qatar",
  description: "",
  BedRooms: 3,
  Bathrooms: 3,
  Area: 2000,
  yearBuilt: new Date().getFullYear(),
  furnishing: "Unfurnished",
  parking: 1,
  images: [placeholderImg.src],
  amenities: [],
  features: [],
  NearByLocations: [],
  documents: [],
  agent: [],
  isHidden: false,
  status: "AVAILABLE",
  createdAt: new Date().toISOString(),
  propertyType: "BUILDING",
  featured: false,
  targetType: "PROPERTY",
  usageType: "RESIDENTIAL"
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
  const [deleteProcess, startProcess] = useTransition();
  const [p, setP] = useState<Property>(blank(id, search));
  const [thread, startThread] = useTransition();
  const [load, startLoad] = useTransition();

  const handleFeaturedToggle = (checked: boolean) => {
    setP((prev) => ({
      ...prev,
      featured: checked,
    }));
  };
  const fetchData = (id: string) =>
    startLoad(async () => {
      const req = await axios.get(
        `/api/properties?id=${id}&details=${Boolean("true")}`
      );
      if (req.status === 200) {
        console.log(req.data);
        setP(req.data.data[0]);
      }
    });

  const onDelete = () =>
    startProcess(async () => {
      const req = await axios.delete(`/api/properties?id=${p.id}`);

      if (req.status === 200) {
        navigate.back();
      }
    });

  const onToggleHide = () =>
    startThread(async () => {
      console.log(p.id);
      const req = await axios.put(`/api/properties`, {
        toggleHide: !p.isHidden,
        id: p.id,
      });
      if (req.status === 200) {
        toast.success("Done!");
        p.isHidden = !p.isHidden;
      }
    });

  const propertyPayload = {
    title: p.title,
    description: p.description,
    images: p.images,
    youtubeLink: p.videoTourUrl,
    amenities: p.amenities,
    features: p.features,
    category: p.category?.toUpperCase(),
    status: p.status?.toUpperCase(),
    price: p.price,
    Area: p.Area,
    NearByLocations: p.NearByLocations,
    BedRooms: p.BedRooms,
    Bathrooms: p.Bathrooms,
    parking: p.parking,
    furnishing: p.furnishing,
    HoaFees: p.hoaFee,
    propertyType: p.propertyType,
    pngImage: p.pngImage,
    yearBuilt: p.yearBuilt,
    addressId: p.addressId,
    agentIds: p.agentIds,
    featured: p.featured,
    targetType: p.targetType,
    usageType: p.usageType,
    documents: p.documents
  };

  type ImageInput = string | File;

  async function processImages(p: {
    images: ImageInput[];
    pngImage: ImageInput | null;
  }) {
    // Process gallery images
    const updatedImages = await Promise.all(
      (p.images || []).map(async (img) => {
        if (typeof img === "string") return img;
        return await uploadFile(img);
      })
    );

    // Process single PNG image
    let updatedPngImage: string | null = null;

    if (p.pngImage) {
      updatedPngImage =
        typeof p.pngImage === "string"
          ? p.pngImage
          : await uploadFile(p.pngImage);
    }

    return { updatedImages, updatedPngImage };
  }

  const saveNewProperty = () =>
    startThread(async () => {
      const { updatedImages, updatedPngImage } = await processImages({
        images: p.images ?? [],
        pngImage: p.pngImage ?? null,
      });

      const finalPayload = {
        ...propertyPayload,
        images: updatedImages,
        pngImage: updatedPngImage,
      };

      const req = await axios.post("/api/properties", finalPayload);
      if (req.status === 201) {
        navigate.push(`/dashboard/properties/${search}`);
        toast.success("Added successfully!");
      }
    });

  const updateProperty = (id: string) =>
    startThread(async () => {
      const { updatedImages, updatedPngImage } = await processImages({
        images: p.images ?? [],
        pngImage: p.pngImage ?? null,
      });

      const finalPayload = {
        ...propertyPayload,
        images: updatedImages,
        pngImage: updatedPngImage,
      };

      const req = await axios.put("/api/properties", {
        id,
        ...finalPayload,
      });

      if (req.status === 200) {
        navigate.push(`/dashboard/properties/${search}`);
        toast.success("Updated successfully!");
      }
    });

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
      "Area",
      "addressId",
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
        return;
      }
    }
    existing ? updateProperty(id) : saveNewProperty();
    toast.success(existing ? "Property updated" : "Property created");
  };

  useEffect(() => {
    if (existing) {
      fetchData(id);
    }
  }, []);

  if (load) {
    return <LoaderScreen />;
  }

  return (
    <>
      <PageHeader
        eyebrow={existing ? "Edit Property" : "New Property"}
        title={p.title || "Untitled Property"}
        subtitle={`${p.category}`}
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
              {thread ? (
                <Loader className="animate-spin" />
              ) : (
                <div className="flex gap-2 justify-center items-center">
                  <Save className="h-4 w-4" /> {existing ? "Update" : "Save"}
                </div>
              )}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: tabs of editable sections */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="overview">
            <TabsList className="rounded-xl bg-secondary p-1 h-auto flex-wrap">
              {["overview", "media","documents","personalized_documents", "amenities", "location", "agent"].map(
                (t) => (
                  <TabsTrigger
                    key={t}
                    value={t}
                    className="rounded-lg capitalize data-[state=active]:bg-card data-[state=active]:shadow-card px-3.5 py-1.5 text-xs sm:text-sm"
                  >
                    {t.replaceAll("_"," ")}
                  </TabsTrigger>
                )
              )}
            </TabsList>

            <TabsContent value="overview">
              <Overview upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="media">
              <Media upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="documents">
              <Documents upd={upd} p={p} />
            </TabsContent>
            <TabsContent value="personalized_documents">
              <PersonalizedDocsTab id={id} p={p} />
            </TabsContent>
            <TabsContent value="amenities">
              <Amenities upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="location">
              <Location upd={upd} p={p} />
            </TabsContent>

            <TabsContent value="agent">
              <AgentsTab p={p} update={upd} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: preview + visibility */}
        <div className="space-y-4">
          {/* <Card className="rounded-2xl shadow-card border-0 overflow-hidden"> */}
          <img
            src={p.images[0]}
            alt=""
            className="h-52 w-full object-cover rounded-xl"
            loading="lazy"
          />
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-md">
                {p.category}
              </Badge>
              {p.status === "SOLD" && (
                <Badge className="bg-success text-success-foreground rounded-md">
                  Sold
                </Badge>
              )}
              {p.isHidden && (
                <Badge variant="outline" className="rounded-md">
                  Hidden
                </Badge>
              )}
            </div>
            <div className="font-grotesk font-semibold">
              {p.title || "Untitled"}
            </div>
            <div className="text-xs text-muted-foreground">
              {p.address?.street}, {p.address?.city}, {p.address?.state},{" "}
              {p.address?.zipCode}
            </div>
            <div className="text-lg font-grotesk text-gold-gradient font-semibold">
              {p.currency} {p.price.toLocaleString()}
            </div>
          </div>
          {/* </Card> */}
          {/* <Card className="rounded-2xl p-4 shadow-card border-0"> */}
          <div className="flex items-center justify-between px-4 pt-4 border-t border-gray-300">
            <div>
              <div className="font-medium text-sm">Visibility on website</div>
              <div className="text-xs text-muted-foreground">
                Toggle to hide/unhide listing
              </div>
            </div>
            <Switch checked={!p.isHidden} onCheckedChange={onToggleHide} />
          </div>
          {/* Featured Toggle */}
          <div className="flex px-4 items-center justify-between">
            <div>
              <div className="text-sm font-medium">Feature Property</div>
              <div className="text-xs text-muted-foreground">
                Highlight this property on homepage
              </div>
            </div>

            <Switch
              checked={p.featured}
              onCheckedChange={handleFeaturedToggle}
            />
          </div>
          {existing && (
            <div className="flex items-center justify-between px-4 pt-4 border-t border-gray-300">
              <div>
                <div className="font-medium text-sm">Delete the Project</div>
              </div>
              {deleteProcess ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Trash2
                  size={16}
                  className="text-red-400 cursor-pointer"
                  onClick={onDelete}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
