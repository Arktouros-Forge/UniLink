import options from "@app/constants/options.json";

export const useStatus = (group, value) => options[group]?.[value] ?? { label: value, tone: "neutral" };
