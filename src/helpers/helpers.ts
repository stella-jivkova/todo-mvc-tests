/**
 * Will replace placehoders in a sting with given values.
 * @param template - string conatinig placeholders
 * @param placeholder - regex to match placeholders by
 * @param values - array of values
 * @returns string
 */
export function replacePlaceholders(template: string, placeholder: RegExp, values: unknown[]): string {
  values.forEach(value => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'boolean':
        template = template.replace(placeholder, value as string);
        break;
      case 'object': {
        const stringValue = value ? value.toString() : 'null';
        template = template.replace(placeholder, stringValue);
        break;
      }
    }
  });
  return template;
}
