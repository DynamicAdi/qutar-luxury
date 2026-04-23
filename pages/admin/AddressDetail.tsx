"use client";

import { useEffect, useState, useTransition } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, Property, AddressEntry } from "@/store/cms";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Trash2,
  Bed,
  Bath,
  Maximize2,
  ExternalLink,
  Pencil,
  Loader,
  LucideEdit,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import AddressDialog from "@/misc/AddressDialog";
import LoaderScreen from "@/misc/LoaderScreen";
import { PropertyCard } from "@/misc/properties/PropertiesCard";

export default function AddressDetail({ id }: Readonly<{ id: string }>) {
  const navigate = useRouter();
  const [data, setData] = useState<AddressEntry>();
  const [transition, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const [loading, startLoading] = useTransition();
  const [editing, setEditing] = useState<AddressEntry | null>(null);

  const fetchAddress = () =>
    startTransition(async () => {
      const res = await axios.get(`/api/address?id=${id}`);
      if (res.status === 200) {
        console.log(res.data.data[0]);

        setData(res.data.data[0]);
      }
    });

  const deleteAddress = (id: string) =>
    startTransition(async () => {
      const req = await axios.delete(`/api/address?id=${id}`);
      if (req.status === 200) {
        toast.success("Address deleted");
        navigate.back();
      } else {
        toast.error("Failed to delete address");
      }
    });

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
    deleteAddress(data.id);
    toast.success("Address deleted");
    navigate.back();
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
      const res = await axios.put(`/api/address`, {
        id,
        city: editing?.city || data.city,
        street: editing?.street || data.street,
        state: editing?.state || data.state,
        zipCode: editing?.zipCode || data.zipCode,
        longitude: editing?.longitude || data.longitude,
        latitude: editing?.latitude || data.latitude,
        gmaps: editing?.gmaps || data.gmaps,
      });

      if (res.status === 200) {
        toast.success("Address updated");
        setData({ ...data, ...editing });
        setEditing(null);
        setOpen(false);
      }
    });
  };
  return (
    <>
      <Card className="rounded-2xl p-2 shadow-card border-0 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate.back()}
            className="rounded-xl gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All addresses
          </Button>
          <div className="h-6 w-px bg-border mx-1" />
          <div className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4 text-primary" /> {data.label}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left 80% — linked properties (no wrapping card, just like the Properties listing) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="font-grotesk font-semibold text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Properties at this
              address
            </div>
            <Badge variant="secondary" className="rounded-md">
              {data.properties.length}
            </Badge>
          </div>

          {data.properties.length === 0 ? (
            <Card className="rounded-2xl p-12 shadow-card border-0 text-center">
              <p className="text-muted-foreground">
                No properties linked to this address yet.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {data.properties.map((p, i) => (
                <PropertyCard
                onDelete={() => {}}
                onToggleHide={() => {}}
                  key={p.id}
                  property={p}
                  index={i}
                  onView={() =>
                    navigate.push(`/dashboard/properties/${p.id}/edit`)
                  }
                  onEdit={() =>
                    navigate.push(`/dashboard/properties/${p.id}/edit`)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Right 20% — address details (transparent, no white bg) */}
        <aside className="lg:col-span-1 h-fit space-y-4">
          <div className="rounded-2xl bg-secondary/40 border border-border/60 p-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex justify-between items-center">
              Label
              <div
                className="mb-4 cursor-pointer text-primary hover:text-gradient-gold"
                onClick={openEdit}
              >
                <LucideEdit size={14} />
              </div>
            </div>
            <h2 className="font-grotesk text-lg font-semibold mt-1">
              {data.label}
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              <Info label="Street">{data.street}</Info>
              <Info label="City">{data.city}</Info>
              <Info label="State">{data.state}</Info>
              <Info label="Latitude">{data.latitude}</Info>
              <Info label="Longitude">{data.longitude}</Info>

              {data.gmaps && (
                <Info label="Google Maps">
                  <div className="w-full h-52 rounded-xl">
                    <iframe
                    title="Maps"
                      src={data.gmaps}
                      loading="lazy"
                      className="w-full h-full my-2 rounded-xl"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </Info>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={askToRemove}
              className="mt-4 w-full rounded-xl text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
            </Button>
          </div>
        </aside>
      </div>

      <AddressDialog
        loading={loading}
        open={open}
        setOpen={setOpen}
        editing={editing}
        setEditing={setEditing}
        save={saveEdit}
      />
    </>
  );
}

function Info({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-medium break-words">{children}</div>
    </div>
  );
}


