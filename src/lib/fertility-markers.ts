export interface FertilityMarker {
  name: string;
  shortName: string;
  value: number | null;
  unit: string;
  normalRange: { min: number; max: number };
  description: string;
}

export interface MarkerInput {
  amh: string;
  fsh: string;
  lh: string;
  estradiol: string;
  tsh: string;
  prolactin: string;
  afc: string;
}

export const defaultMarkers: MarkerInput = {
  amh: "",
  fsh: "",
  lh: "",
  estradiol: "",
  tsh: "",
  prolactin: "",
  afc: "",
};

export const markerInfo: Record<string, { 
  fullName: string; 
  unit: string; 
  description: string;
  placeholder: string;
}> = {
  amh: {
    fullName: "Anti-Müllerian Hormone",
    unit: "ng/mL",
    description: "Indicates ovarian reserve - how many eggs remain",
    placeholder: "e.g., 2.5"
  },
  fsh: {
    fullName: "Follicle-Stimulating Hormone",
    unit: "mIU/mL",
    description: "Helps assess ovarian function and reserve",
    placeholder: "e.g., 6.8"
  },
  lh: {
    fullName: "Luteinizing Hormone",
    unit: "mIU/mL",
    description: "Important for ovulation timing",
    placeholder: "e.g., 5.2"
  },
  estradiol: {
    fullName: "Estradiol (E2)",
    unit: "pg/mL",
    description: "Key estrogen hormone for reproductive health",
    placeholder: "e.g., 45"
  },
  tsh: {
    fullName: "Thyroid-Stimulating Hormone",
    unit: "mIU/L",
    description: "Thyroid function affects fertility",
    placeholder: "e.g., 2.1"
  },
  prolactin: {
    fullName: "Prolactin",
    unit: "ng/mL",
    description: "High levels can affect ovulation",
    placeholder: "e.g., 12"
  },
  afc: {
    fullName: "Antral Follicle Count",
    unit: "follicles",
    description: "Number of small follicles visible on ultrasound",
    placeholder: "e.g., 15"
  },
};

export function parseMarkerValue(value: string): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = parseFloat(value.replace(/[<>]/g, "").trim());
  return isNaN(parsed) ? null : parsed;
}

// Reference ranges by age group
export const ageRanges = {
  amh: {
    "under30": { low: 1.0, normal: { min: 1.5, max: 4.0 }, high: 4.0, optimal: "2.0-4.0" },
    "30-35": { low: 0.8, normal: { min: 1.0, max: 3.5 }, high: 3.5, optimal: "1.5-3.5" },
    "35-40": { low: 0.5, normal: { min: 0.5, max: 2.5 }, high: 2.5, optimal: "1.0-2.5" },
    "over40": { low: 0.3, normal: { min: 0.3, max: 1.5 }, high: 1.5, optimal: "0.5-1.5" },
  },
  fsh: {
    "under30": { low: 3, normal: { min: 3, max: 10 }, high: 10, optimal: "4-8" },
    "30-35": { low: 3, normal: { min: 3, max: 10 }, high: 10, optimal: "4-9" },
    "35-40": { low: 3, normal: { min: 3, max: 12 }, high: 12, optimal: "5-10" },
    "over40": { low: 3, normal: { min: 4, max: 15 }, high: 15, optimal: "6-12" },
  },
};
