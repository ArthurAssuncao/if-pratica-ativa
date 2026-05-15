export const INDENTATION_SIZE = 4;

export const generateIndentation = (indentationLevel: number) => {
  if (indentationLevel <= 0) return "";
  const indentation = Array(indentationLevel * INDENTATION_SIZE)
    .fill(" ")
    .join("");
  return indentation;
};
