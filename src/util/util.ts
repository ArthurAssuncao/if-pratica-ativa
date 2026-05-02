/**
 * Gera uma lista de números entre `start` e `stop`, espaçados por no mínimo `step`.
 *
 * Regras:
 * - `start` e `stop` são sempre incluídos na lista.
 * - A distância entre quaisquer dois números consecutivos é sempre >= `step`.
 * - Quando o último passo ultrapassaria `stop` e a distância entre o penúltimo
 *   elemento e `stop` é menor que `step`, o penúltimo é substituído por `stop`,
 *   garantindo que nenhum intervalo seja menor que `step`.
 * - Funciona tanto para sequências crescentes (`start < stop`) quanto
 *   decrescentes (`start > stop`).
 *
 * @param start - Valor inicial da sequência (sempre incluído).
 * @param stop  - Valor final da sequência (sempre incluído).
 * @param step  - Distância mínima entre os elementos (padrão: 1). Deve ser > 0.
 *
 * @throws {Error} Se `step` for menor ou igual a zero.
 *
 * @example
 * range(0, 9, 3)   // [0, 3, 6, 9]    — cai exato
 * range(0, 10, 3)  // [0, 3, 6, 10]   — 9 substituído por 10 (dist 1 < step 3)
 * range(10, 0, 3)  // [10, 7, 4, 0]   — decrescente
 * range(0, 1, 5)   // [0, 1]          — step maior que o intervalo total
 */
export const rangeStartEnd = (
  start: number,
  stop: number,
  step = 1,
): number[] => {
  if (step <= 0) throw new Error("step must be positive");
  if (start === stop) return [start];

  const result: number[] = [start];
  const ascending = stop > start;

  let current = start;
  while (true) {
    const next = ascending ? current + step : current - step;
    const overshot = ascending ? next >= stop : next <= stop;

    if (overshot) {
      // Se o próximo já ultrapassaria o stop, substituímos pelo stop
      // e garantimos que a distância do último elemento inserido até stop >= step
      const last = result[result.length - 1];
      const distToStop = Math.abs(stop - last);

      if (distToStop < step) {
        // O stop está perto demais do último: substitui o último pelo stop
        result[result.length - 1] = stop;
      } else {
        result.push(stop);
      }
      break;
    }

    result.push(next);
    current = next;
  }

  return result;
};

export const stringToArrayNumber = (str: string | number) => {
  return String(str)
    .replace(/[[\]\s]/g, "") // Remove colchetes e espaços
    .split(",") // Corta na vírgula
    .map(Number);
};

export const compareArrays = (
  a: string[] | number[],
  b: string[] | number[],
) => {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
};
