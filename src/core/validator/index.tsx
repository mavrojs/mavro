import { ValidationRules, ValidationResult } from '../types'

export class Validator {
  private data: any;
  private rules: ValidationRules;
  private errors: ValidationResult = {};

  constructor(data: any, rules: ValidationRules) {
    this.data = data;
    this.rules = rules;
  }

  /**
   * Main method to perform validation based on rules provided.
   * It will iterate over the rules and apply validations to the corresponding fields.
   */
  validate(): boolean {
    for (const [field, ruleString] of Object.entries(this.rules)) {
      const rules = ruleString.split('|');
      for (const rule of rules) {
        const [ruleName, param] = rule.split(':');
        if (!this.applyRule(field, ruleName, param)) {
          this.addError(field, ruleName, param);
        }
      }
    }
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Method to apply a specific rule to a field.
   * It will delegate to appropriate rule-checking methods.
   */
  private applyRule(field: string, rule: string, param?: string): boolean {
    const value = this.data[field];
    switch (rule) {
      case 'required':
        return this.isRequired(value);
      case 'email':
        return this.isEmail(value);
      case 'min':
        return this.hasMinLength(value, Number(param));
      // Add other rules here like max, numeric, etc.
      default:
        return true;
    }
  }

  private isRequired(value: any): boolean {
    return value !== undefined && value !== null && value !== '';
  }

  private isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private hasMinLength(value: string, length: number): boolean {
    return value.length >= length;
  }

  private addError(field: string, rule: string, param?: string): void {
    const message = this.getErrorMessage(field, rule, param);
    if (!this.errors[field]) {
      this.errors[field] = [];
    }
    this.errors[field].push(message);
  }

  private getErrorMessage(field: string, rule: string, param?: string): string {
    const messages = {
      required: `${field} is required.`,
      email: `${field} must be a valid email address.`,
      min: `${field} must be at least ${param} characters long.`,
      // Add other messages here
    };
    return messages[rule] || `${field} is invalid.`;
  }

  /**
   * Returns the errors found during validation.
   */
  getErrors(): ValidationResult {
    return this.errors;
  }
}