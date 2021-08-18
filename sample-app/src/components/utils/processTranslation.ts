export function processTranslation(args: {
  phrase: string,
  pluralForm?: string,
  count?: number,
}) {
  if (args.count && args.pluralForm && args.count >= 2) {
    return args.pluralForm
  } else {
    return args.phrase;
  }
}