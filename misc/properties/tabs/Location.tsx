import { Card } from "@/components/ui/card";
import React from "react";
import { AddressPicker } from "../AddressPicker";

import { Input } from "@base-ui/react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

function Location({ p, upd }: { p: any; upd: any }) {
  return (
    <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
      <AddressPicker p={p} upd={upd} />
      <div className="pt-4 border-t border-border">
        <Label className="block">Nearby Landmarks</Label>
        <p className="text-xs text-muted-foreground mt-1 mb-3">
          These are saved on this property only — not on the saved Address.
        </p>
        <div className="space-y-2">
          {p.NearByLocations.length > 0 ? (
            p.NearByLocations.map((n: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input
                  className="rounded-xl col-span-5 py-2 px-4"
                  placeholder="Name"
                  value={n.name}
                  onChange={(e) =>
                    upd(
                      "NearByLocations",
                      p.NearByLocations.map((x: any, idx: any) =>
                        idx === i ? { ...x, name: e.target.value } : x
                      )
                    )
                  }
                />
                <Input
                  className="rounded-xl col-span-5 py-2 px-4"
                  placeholder="Type"
                  value={n.type}
                  onChange={(e) =>
                    upd(
                      "NearByLocations",
                      p.NearByLocations.map((x: any, idx: any) =>
                        idx === i ? { ...x, type: e.target.value } : x
                      )
                    )
                  }
                />
                <button
                  onClick={() =>
                    upd(
                      "NearByLocations",
                      p.NearByLocations.filter((_: any, idx: any) => idx !== i)
                    )
                  }
                  className="col-span-1 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4 mx-auto" />
                </button>
              </div>
            ))
          ) : (
            <p>No Nearby Locations</p>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              upd("NearByLocations", [
                ...p.NearByLocations,
                { name: "", type: "", distanceKm: 0 },
              ])
            }
            className="rounded-xl"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add nearby
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default Location;
