import validation from "@app/constants/validation.json";

const rules = validation.rules.map((rule) => ({ test: new RegExp(rule.pattern), text: rule.text }));

export const translateError = (message = "") => {
  for (const rule of rules) {
    const match = message.match(rule.test);
    if (match) return rule.text.replace("$1", match[1] ?? "");
  }
  return message;
};

export const firstErrors = (errors = []) => {
  const result = {};
  for (const item of errors) if (item.field && !(item.field in result)) result[item.field] = translateError(item.message);
  return result;
};

const text = (value) => String(value ?? "").trim();

export const rule = {
  required: (value) => (Array.isArray(value) ? value.length : text(value)) ? "" : validation.required,
  min: (value, length) => (text(value).length >= length ? "" : validation.min.replace("$1", length)),
};

export const collect = (checks) =>
  Object.fromEntries(Object.entries(checks).filter(([, message]) => message));
