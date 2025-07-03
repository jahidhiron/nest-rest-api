import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsExcluded', async: false })
export class IsExcludedConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return value === undefined;
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property} is not allowed to be updated`;
  }
}

export function IsExcluded(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: IsExcludedConstraint,
    });
  };
}
