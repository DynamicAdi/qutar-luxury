"use client";

import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Property, PropertyCategory } from "@/store/cms";
import { Textarea } from "@/components/ui/textarea";

function Overview({ p, upd }: { p: any; upd: any }) {
  return (
    <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
      <Field label="Title">
        <Input
          value={p.title}
          onChange={(e) => upd("title", e.target.value)}
          className="rounded-xl"
          placeholder="Pearl Marina Signature Villa"
        />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Category">
          <Select
            value={p.category}
            onValueChange={(v) => upd("category", v as PropertyCategory)}
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                [
                  "BUY",
                  "SELL",
                  "RENT",
                  "PLOTS",
                  "RESIDENTIAL",
                  "COMMERCIAL",
                ] as PropertyCategory[]
              ).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={p.status}
            onValueChange={(v) => upd("status", v as Property["status"])}
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["AVAILABLE", "RESERVED", "SOLD", "IN_PROGRESS"].map((s) => (
                <SelectItem key={s} value={s}>
                  {s?.replaceAll("_"," ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Property Type">
          <Select
            value={p.propertyType || "BUILDING"}
            onValueChange={(v) =>
              upd("propertyType", v as Property["propertyType"])
            }
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["BUILDING", "APARTMENT", "PLOT", "PROJECT", "PROPERTY"].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </Field>
        
        <div className="col-span-3">
        <Field label="Target Type">
          <Select
            value={p.targetType || "PROPERTY"}
            onValueChange={(v) =>
              upd("targetType", v as Property["targetType"])
            }
          >
            <SelectTrigger className="rounded-xl w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["PROPERTY","PROJECT",...(p.category === "RESIDENTIAL" ? ["BOTH"] : [])].map(
                (s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </Field>
        </div>
      </div>
      <Field label="Description">
        <Textarea
          value={p.description}
          onChange={(e) => upd("description", e.target.value)}
          className="rounded-xl min-h-32"
        />
      </Field>

      {/* Common: price + area */}
      <div className="grid md:grid-cols-3 gap-3">
        <Field label={p.category === "Rent" ? "Rent (QAR)" : "Price (QAR)"}>
          <Input
            type="number"
            value={p.price}
            onChange={(e) => upd("price", +e.target.value)}
            className="rounded-xl"
          />
        </Field>
        <Field
          label={
            p.category === "Plots" ? "Land Area (sqft)" : "Built-up Area (sqft)"
          }
        >
          <Input
            type="number"
            value={p.Area}
            onChange={(e) => upd("Area", +e.target.value)}
            className="rounded-xl"
          />
        </Field>
        {p.category === "PLOTS" && (
          <Field label="Plot Area (sqm)">
            <Input
              type="number"
              value={p.plotArea || 0}
              onChange={(e) => upd("plotArea", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
        )}
      </div>

      {/* Building fields — hidden for Plots */}
      {p.category !== "Plots" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Bedrooms">
            <Input
              type="number"
              value={p.BedRooms}
              onChange={(e) => upd("BedRooms", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Bathrooms">
            <Input
              type="number"
              value={p.Bathrooms}
              onChange={(e) => upd("Bathrooms", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Year Built">
            <Input
              type="number"
              value={p.yearBuilt}
              onChange={(e) => upd("yearBuilt", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Parking">
            <Input
              type="number"
              value={p.parking}
              onChange={(e) => upd("parking", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Furnishing">
            <Select
              value={p.furnishing}
              onValueChange={(v) =>
                upd("furnishing", v as Property["furnishing"])
              }
            >
              <SelectTrigger className="rounded-xl w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Furnished", "Semi-Furnished", "Unfurnished"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {p.category !== "Rent" && (
            <Field label="HOA Fee (QAR/mo)">
              <Input
                type="number"
                value={p.hoaFee || 0}
                onChange={(e) => upd("hoaFee", +e.target.value)}
                className="rounded-xl"
              />
            </Field>
          )}
        </div>
      )}

      {/* Plot-specific */}
      {p.category === "Plots" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Zoning">
            <Select
              value={p.zoning || "Residential"}
              onValueChange={(v) => upd("zoning", v as Property["zoning"])}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Residential",
                  "Commercial",
                  "Mixed-Use",
                  "Industrial",
                  "Agricultural",
                ].map((z) => (
                  <SelectItem key={z} value={z}>
                    {z}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Road Access">
            <Select
              value={p.roadAccess || "Paved"}
              onValueChange={(v) =>
                upd("roadAccess", v as Property["roadAccess"])
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Paved", "Unpaved", "Highway-adjacent", "None"].map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Utilities Ready">
            <Select
              value={p.utilitiesReady ? "Yes" : "No"}
              onValueChange={(v) => upd("utilitiesReady", v === "Yes")}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Yes", "No"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Corner Plot">
            <Select
              value={p.cornerPlot ? "Yes" : "No"}
              onValueChange={(v) => upd("cornerPlot", v === "Yes")}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Yes", "No"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      )}

      {/* Rent-specific */}
      {p.category === "Rent" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Field label="Rent Period">
            <Select
              value={p.rentPeriod || "Monthly"}
              onValueChange={(v) =>
                upd("rentPeriod", v as Property["rentPeriod"])
              }
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Monthly", "Yearly"].map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Min Lease (months)">
            <Input
              type="number"
              value={p.minLeaseMonths || 0}
              onChange={(e) => upd("minLeaseMonths", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Deposit (months)">
            <Input
              type="number"
              value={p.depositMonths || 0}
              onChange={(e) => upd("depositMonths", +e.target.value)}
              className="rounded-xl"
            />
          </Field>
          <Field label="Available From">
            <Input
              type="date"
              value={p.availableFrom || ""}
              onChange={(e) => upd("availableFrom", e.target.value)}
              className="rounded-xl"
            />
          </Field>
        </div>
      )}
    </Card>
  );
}

export default Overview;
