import { INDENTATION_SIZE } from "../constants/general";

export const countIndentationLevel = (codeLine: string): number => {
  const line = codeLine;

  if (!line.trim()) return 0;

  const whitespace = line.match(/^\s*/)?.[0] || "";
  const tabs = (whitespace.match(/\t/g) || []).length;
  const spaces = (whitespace.match(/ /g) || []).length;
  const indentationLevel = tabs + Math.floor(spaces / INDENTATION_SIZE);

  return indentationLevel;
};
