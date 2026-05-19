import type { CorrectAnswer, RearrangeRow } from "../types/study";

export const getAnswer = (answer: CorrectAnswer): string => {
  if ("text" in answer) {
    return answer.text || "";
  }
  if (Array.isArray(answer.option)) {
    return answer.option.join(" e ");
  }
  return answer.option.toString() || "";
};

export const clickOnErrorEditorDefineId = (
  stableIds: string[] | number[],
  index: number,
) => {
  return stableIds[index];
};

export const rearrangeAnswer = (rows: RearrangeRow[]) => {
  return rows.map((r) => "\t".repeat(r.identationLevel) + r.text).join("\n");
};
