import { useEffect, useMemo, useState } from "react";
import {
  Property,
  PropertyCategory,
  PropertyUsageType,
  formatQAR,
} from "@/lib/properties";
import axios from "axios";
import { qatarCities, qatarCitiesByState, qatarStates } from "@/config";

export interface FilterState {
  category: PropertyCategory | "ALL";
  state: string;
  cities: string[];
  street: string;
  priceMin: number;
  priceMax: number;
  usageType: PropertyUsageType;
}

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

const usageTypes: PropertyUsageType[] = ["RESIDENTIAL", "COMMERCIAL"];

const categories: (PropertyCategory | "ALL")[] = [
  "ALL",
  "BUY",
  "RENT",
  "SELL",
  "PLOTS",
];

export const PRICE_FLOOR = 0;
export const PRICE_CEIL = 50_000_000;

const Filters = ({ value, onChange }: Props) => {
  const [states, setStates] = useState<string[]>(
    Object.keys(qatarCitiesByState)
  );
  const [streets, setStreets] = useState<string[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const availableCities =
    value.state &&
    qatarCitiesByState[value.state as keyof typeof qatarCitiesByState]
      ? qatarCitiesByState[value.state as keyof typeof qatarCitiesByState]
      : [];
  const pct = (v: number) =>
    ((v - PRICE_FLOOR) / (PRICE_CEIL - PRICE_FLOOR)) * 100;

  return (
    <div className="space-y-7">
      {/* CATEGORY — bold pill buttons */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase shrink-0 md:w-28">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = value.category === c;
            return (
              <button
                key={c}
                onClick={() => onChange({ ...value, category: c })}
                className={`px-4 py-2 font-display text-sm tracking-[0.2em] uppercase border transition-colors ${
                  active
                    ? "bg-emerald text-primary-foreground border-emerald"
                    : "bg-card text-foreground border-border hover:border-emerald hover:text-emerald"
                }`}
              >
                {c === "ALL" ? "All" : c}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase shrink-0 md:w-28">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {usageTypes.map((c) => {
            const active = value.usageType === c;
            return (
              <button
                key={c}
                onClick={() => onChange({ ...value, usageType: c })}
                className={`px-4 py-2 font-display text-sm tracking-[0.2em] uppercase border transition-colors ${
                  active
                    ? "bg-emerald text-primary-foreground border-emerald"
                    : "bg-card text-foreground border-border hover:border-emerald hover:text-emerald"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* LOCATION — three cascading selects */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase shrink-0 md:w-28">
          Location
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          {/* STATE */}
          <select
            value={value.state}
            onChange={(e) =>
              onChange({
                ...value,
                state: e.target.value,
                cities: [],
                street: "",
              })
            }
            className="h-15 px-3 bg-card border border-border font-body text-sm text-foreground hover:border-emerald focus:border-emerald outline-none cursor-pointer"
          >
            <option value="">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* MULTI CITY */}
          <div className="border border-border min-h-11 px-3 py-2 bg-card">
            <div className="flex flex-wrap gap-2 mb-2">
              {value.cities.map((city) => (
                <div
                  key={city}
                  className="px-2 py-1 bg-emerald text-white text-xs rounded-full flex items-center gap-2"
                >
                  {city}
                  <button
                    type="button"
                    onClick={() =>
                      onChange({
                        ...value,
                        cities: value.cities.filter((c) => c !== city),
                        street: "",
                      })
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <select
              disabled={!value.state}
              value=""
              onChange={(e) => {
                const city = e.target.value;

                if (
                  !city ||
                  value.cities.includes(city) ||
                  value.cities.length >= 3
                )
                  return;

                onChange({
                  ...value,
                  cities: [...value.cities, city],
                  street: "",
                });
              }}
              className="w-full bg-transparent outline-none text-sm"
            >
              <option value="">{availableCities.length===0 ? "Select State First":"You can select Upto 3 cities"}</option>

              {availableCities
                .filter((c) => !value.cities.includes(c))
                .map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          {/* STREET */}
          <select
            disabled={loadingPlaces}
            value={value.street}
            onChange={(e) => onChange({ ...value, street: e.target.value })}
            className="h-15 px-3 bg-card border border-border font-body text-sm text-foreground hover:border-emerald focus:border-emerald outline-none cursor-pointer"
          >
            <option value="">All Streets</option>
            {streets.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRICE — dual range slider */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
        <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase shrink-0 md:w-28">
          Price
        </p>
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-3">
            <span className="font-display text-base font-semibold">
              {formatQAR(value.priceMin)}
            </span>
            <span className="font-body text-xs text-muted-foreground uppercase tracking-[0.2em]">
              to
            </span>
            <span className="font-display text-base font-semibold">
              {value.priceMax >= PRICE_CEIL
                ? `${formatQAR(PRICE_CEIL)}+`
                : formatQAR(value.priceMax)}
            </span>
          </div>
          <div className="relative h-8">
            {/* track */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-secondary rounded-full" />
            {/* selected */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1 bg-emerald rounded-full"
              style={{
                left: `${pct(value.priceMin)}%`,
                right: `${100 - pct(value.priceMax)}%`,
              }}
            />
            <input
              type="range"
              min={PRICE_FLOOR}
              max={PRICE_CEIL}
              step={100000}
              value={value.priceMin}
              onChange={(e) => {
                const v = Math.min(
                  Number(e.target.value),
                  value.priceMax - 100000
                );
                onChange({ ...value, priceMin: v });
              }}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={PRICE_FLOOR}
              max={PRICE_CEIL}
              step={100000}
              value={value.priceMax}
              onChange={(e) => {
                const v = Math.max(
                  Number(e.target.value),
                  value.priceMin + 100000
                );
                onChange({ ...value, priceMax: v });
              }}
              className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;
