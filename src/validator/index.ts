import { ValidationRules, ValidationResult } from "../types";

type ValidationRule = "required" | "email" | "min";

export class Validator {
  private data: any;
  private rules: ValidationRules;
  private errors: ValidationResult = {};

  /**
   * Creates an instance of Validator.
   * 
   * @param data - The data object that contains the fields to be validated.
   * @param rules - The validation rules to be applied to the data fields.
   */
  constructor(data: any, rules: ValidationRules) {
    this.data = data;
    this.rules = rules;
  }

  /**
   * Validates the data according to the provided rules.
   * Iterates over the fields and rules, and applies each rule to its respective field.
   * 
   * @returns {boolean} - Returns true if all validations pass, otherwise false.
   */
  validate(): boolean {
    for (const [field, ruleString] of Object.entries(this.rules)) {
      const rules = ruleString.split("|");
      for (const rule of rules) {
        const [ruleName, param] = rule.split(":");
        if (!this.applyRule(field, ruleName, param)) {
          this.addError(field, ruleName, param);
        }
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Applies a validation rule to a specific field.
   * 
   * @param field - The field being validated.
   * @param rule - The name of the validation rule to be applied.
   * @param param - An optional parameter, such as the minimum length for the "min" rule.
   * @returns {boolean} - Returns true if the field passes the validation, otherwise false.
   */
  private applyRule(field: string, rule: string, param?: string): boolean {
    const value = this.data.hasOwnProperty(field) ? this.data[field] : null;
    switch (rule) {
      case "required":
        return this.isRequired(value);
      case "email":
        return this.isEmail(value);
      case "min":
        return this.hasMinLength(value, Number(param));
      // we will add other rules here like max, numeric, etc.
      default:
        return true;
    }
  }

  /**
   * Checks if the value is required and not empty.
   * 
   * @param value - The value to be checked.
   * @returns {boolean} - Returns true if the value is not empty, otherwise false.
   */
  private isRequired(value: any): boolean {
    return value !== undefined && value !== null && value !== "";
  }

  /**
   * Checks if the value is a valid email address.
   * 
   * @param value - The value to be checked.
   * @returns {boolean} - Returns true if the value is a valid email, otherwise false.
   */
  private isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof value === "string" && emailRegex.test(value);
  }

  /**
   * Checks if the value has the minimum required length.
   * 
   * @param value - The value to be checked.
   * @param length - The minimum required length.
   * @returns {boolean} - Returns true if the value meets the length requirement, otherwise false.
   */
  private hasMinLength(value: string, length: number): boolean {
    return typeof value === "string" && value.length >= length;
  }

  /**
   * Adds an error message for the field if the validation rule fails.
   * If the rule is not recognized, it adds a default invalid rule message.
   * 
   * @param field - The field being validated.
   * @param rule - The name of the validation rule.
   * @param param - An optional parameter, such as the minimum length for the "min" rule.
   */
  private addError(field: string, rule: string, param?: string): void {
    if (this.isValidRule(rule)) {
      const message = this.getErrorMessage(field, rule as ValidationRule, param);
      if (!this.errors[field]) {
        this.errors[field] = [];
      }
      this.errors[field].push(message);
    } else {
      const message = `${field} has an invalid validation rule: ${rule}`;
      if (!this.errors[field]) {
        this.errors[field] = [];
      }
      this.errors[field].push(message);
    }
  }

  /**
   * Retrieves the error message based on the validation rule.
   * 
   * @param field - The field being validated.
   * @param rule - The name of the validation rule.
   * @param param - An optional parameter, such as the minimum length for the "min" rule.
   * @returns {string} - Returns the appropriate error message for the rule.
   */
  private getErrorMessage(
    field: string,
    rule: ValidationRule,
    param?: string
  ): string {
    const messages: Record<ValidationRule, string> = {
      required: `${field} is required.`,
      email: `${field} must be a valid email address.`,
      min: `${field} must be at least ${param} characters long.`,
    };

    return messages[rule] || `${field} is invalid.`;
  }

  /**
   * Checks if the provided rule is a valid validation rule.
   * 
   * @param rule - The rule to be checked.
   * @returns {boolean} - Returns true if the rule is valid, otherwise false.
   */
  private isValidRule(rule: string): rule is ValidationRule {
    const validRules: ValidationRule[] = ["required", "email", "min"];
    return validRules.includes(rule as ValidationRule);
  }

  /**
   * Retrieves the errors found during the validation process.
   * 
   * @returns {ValidationResult} - An object containing field names as keys and arrays of error messages as values.
   */
  getErrors(): ValidationResult {
    return this.errors;
  }
}
