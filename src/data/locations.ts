import { City } from "@/types";

export const cities: City[] = ["Karachi", "Lahore", "Islamabad"];

export const areasByCity: Record<City, string[]> = {
  Karachi: [
    "2 Talwar",
    "3 Talwar",
    "DHA Phase 1",
    "DHA Phase 2",
    "DHA Phase 3",
    "DHA Phase 4",
    "DHA Phase 5",
    "DHA Phase 6",
    "DHA Phase 7",
    "DHA Phase 8",
    "Clifton",
    "Gizri",
    "PECHS",
    "Bahadurabad",
    "Gulshan",
    "Johar",
    "Saddar",
    "Nazimabad",
    "Scheme 33",
    "Malir",
    "Tariq Road",
    "Korangi",
    "Bahria Town Karachi",
  ],
  Lahore: ["DHA Lahore", "Gulberg", "Model Town", "Johar Town"],
  Islamabad: ["F-6", "F-7", "F-8", "G-10"],
};
