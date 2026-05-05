"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { SelectableChipEditor } from "@/components/client/properties/SelectableChipEditor";

function Amenities({ p, upd }: { p: any; upd: any }) {
  return (
    <Card className="rounded-2xl p-5 shadow-card border-0 space-y-6">
      <SelectableChipEditor
        label="Amenities"
        items={p.amenities}
        onChange={(v) => upd("amenities", v)}
        suggestions={[
          "Private Pool",
          "Gym",
          "Spa",
          "Sauna",
          "Smart Home",
          "Home Cinema",
          "Wine Cellar",
          "Concierge",
          "Maid Quarters",
          "Driver Quarters",
          "Kids Area",
          "Tennis Court",
        ]}
      />

      <SelectableChipEditor
        label="Features"
        items={p.features}
        onChange={(v) => upd("features", v)}
        suggestions={[
          "Sea View",
          "Skyline View",
          "Marina Access",
          "Private Elevator",
          "Italian Marble",
          "Solar Roof",
          "Pet Friendly",
          "Smart Lighting",
        ]}
      />
    </Card>
  );
}

export default Amenities;
