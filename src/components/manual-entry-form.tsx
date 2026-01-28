"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkerInput, markerInfo } from "@/lib/fertility-markers";

interface ManualEntryFormProps {
  markers: MarkerInput;
  onChange: (markers: MarkerInput) => void;
}

export function ManualEntryForm({ markers, onChange }: ManualEntryFormProps) {
  const handleChange = (key: keyof MarkerInput, value: string) => {
    onChange({ ...markers, [key]: value });
  };

  return (
    <div className="grid gap-6">
      {(Object.keys(markerInfo) as Array<keyof MarkerInput>).map((key) => {
        const info = markerInfo[key];
        return (
          <div key={key} className="grid gap-2">
            <Label htmlFor={key} className="flex items-center justify-between">
              <span>
                <span className="font-medium">{info.fullName}</span>
                <span className="text-muted-foreground ml-2">({info.unit})</span>
              </span>
            </Label>
            <p className="text-sm text-muted-foreground -mt-1">{info.description}</p>
            <Input
              id={key}
              type="text"
              inputMode="decimal"
              placeholder={info.placeholder}
              value={markers[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="bg-white"
            />
          </div>
        );
      })}
    </div>
  );
}
