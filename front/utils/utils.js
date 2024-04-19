import { description } from "./codes.json";

export function overlapRange(r1, r2) {
  return r2.start < r1.start ? r2.end > r1.start :  r2.start < r1.end;
}

export const countries = [
  "Chile",
  { divider: true },
  "Argentina",
  "Bolivia",
  "Colombia",
  "Costa Rica",
  "Cuba",
  "Ecuador",
  "El Salvador",
  "España",
  "Guatemala",
  "Guinea Ecuatorial",
  "Honduras",
  "México",
  "Nicaragua",
  "Panamá",
  "Paraguay",
  "Perú",
  "Puerto Rico",
  "República Dominicana",
  "Uruguay",
  "Venezuela",
  { divider: true },
  "Andorra",
  "Antigua y Barbuda",
  "Bahamas",
  "Barbados",
  "Belice",
  "Brasil",
  "Canadá",
  "Estados Unidos",
  "Filipinas",
  "Francia",
  "Gibraltar",
  "Guyana",
  "Haití",
  "Italia",
  "Israel",
  "Jamaica",
  "Marruecos",
  "Portugal",
  "Surinam"
];

export function getCodeDescription(code){
  return description[code];
}
