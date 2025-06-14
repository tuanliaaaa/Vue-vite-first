type ValidatorFn<T> = (value: T) => boolean;

interface Rule<T> {
  validate: ValidatorFn<T>;
  message: string;
}

abstract class BaseValidator<T> {
  protected rules: Rule<T>[] = [];

  abstract checkType(value: any): value is T;

  required(message = 'This field is required'): this {
    return this.addRule(v => v !== undefined && v !== null && v !== '', message);
  }

  protected addRule(fn: ValidatorFn<T>, message: string): this {
    this.rules.push({ validate: fn, message });
    return this;
  }

  validate(value: any): string | null {
    if (!this.checkType(value)) {
      return `This field must be of type ${typeof value}`;
    }
    for (const rule of this.rules) {
      if (!rule.validate(value)) {
        return rule.message;
      }
    }
    return null;
  }
}

export class StringValidator extends BaseValidator<string> {
  checkType(value: any): value is string {
    return typeof value === 'string';
  }

  email(message = 'Email không hợp lệ'): this {
    return this.addRule(
      v => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message
    );
  }

  min(minLength: number, message?: string): this {
    return this.addRule(
      v => v.length >= minLength,
      message || `Tối thiểu ${minLength} ký tự`
    );
  }

  max(maxLength: number, message?: string): this {
    return this.addRule(
      v => v.length <= maxLength,
      message || `Tối đa ${maxLength} ký tự`
    );
  }
}

export class NumberValidator extends BaseValidator<number> {
  checkType(value: any): value is number {
    return typeof value === 'number';
  }

  min(min: number, message?: string): this {
    return this.addRule(
      v => v >= min,
      message || `Giá trị tối thiểu là ${min}`
    );
  }

  max(max: number, message?: string): this {
    return this.addRule(
      v => v <= max,
      message || `Giá trị tối đa là ${max}`
    );
  }
}

// Factory
export const string = () => new StringValidator();
export const number = () => new NumberValidator();
export function object(schema: Record<string, BaseValidator<any>>) {
  return {
    validate(data: Record<string, any>) {
      const errors: Record<string, string> = {};
      for (const key in schema) {
        const validator = schema[key];
        const error = validator.validate(data[key]);
        if (error) {
          errors[key] = error;
        }
      }
      return errors;
    }
  };
}