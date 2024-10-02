export interface ValidationRules {
  [key: string]: string;
}

export type ValidationRule = "required" | "email" | "min";

export interface ValidationResult {
  [key: string]: string[];
}

