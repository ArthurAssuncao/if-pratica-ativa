/**
 * Extrai o nome base do utilitário Tailwind (remove números, variantes, etc.)
 * Exemplos:
 * - "p-2" → "p"
 * - "p-4" → "p"
 * - "p-2.5" → "p"
 * - "text-sm" → "text"
 * - "text-lg" → "text"
 * - "hover:bg-blue-500" → "hover:bg"
 * - "dark:p-2" → "dark:p"
 * - "md:text-lg" → "md:text"
 */
const getBaseUtility = (className: string): string => {
  // Remove números, pontos, traços no final (ex: p-2, p-2.5, gap-4)
  // Mas preserva pseudo-classes no início (hover:, dark:, md:, etc.)
  const match = className.match(
    /^((?:[a-z]+:)*)([a-zA-Z-]+?)(?:-(\d+(?:\.\d+)?|auto|full|screen|min|max|fit|none))?$/,
  );
  if (match) {
    const prefix = match[1]; // ex: "hover:", "dark:", "md:", etc.
    const base = match[2]; // ex: "p", "text", "bg", "flex"
    return prefix + base;
  }
  return className;
};

/**
 * Verifica se duas classes são do mesmo tipo (considerando pseudo-classes)
 * Exemplos:
 * - "p-2" e "p-4" → true (mesmo utilitário)
 * - "hover:bg-red" e "bg-red" → false (um tem pseudo, outro não)
 * - "dark:p-2" e "p-4" → false (um tem dark:, outro não)
 * - "p-2" e "m-2" → false (utilitários diferentes)
 */
const areSameUtility = (class1: string, class2: string): boolean => {
  const base1 = getBaseUtility(class1);
  const base2 = getBaseUtility(class2);
  return base1 === base2;
};

/**
 * Remove do primeiro as classes que existem no segundo
 * (considerando classes do mesmo utilitário Tailwind como equivalentes)
 * PRIORIZA AS CLASSES DO SEGUNDO PARÂMETRO.
 *
 * @param classes1 - String que terá as classes removidas
 * @param classes2 - String com as classes que serão removidas do primeiro
 * @returns String com as classes do primeiro após remoção
 *
 * @example
 * // Remove w-auto porque w-12 está no segundo (mesmo grupo)
 * getExclusiveClasses("w-auto h-4", "w-12") // "h-4"
 */
export const getExclusiveClasses = (
  classes1: string,
  classes2: string,
): string => {
  const arr1 = classes1.trim().split(/\s+/).filter(Boolean);
  const arr2 = classes2.trim().split(/\s+/).filter(Boolean);

  // Mantém do primeiro apenas o que NÃO tem equivalente no segundo
  const result = arr1.filter((class1) => {
    return !arr2.some((class2) => areSameUtility(class1, class2));
  });

  return result.join(" ");
};

/**
 * Substitui no primeiro as classes que existem no segundo
 * (considerando classes do mesmo utilitário Tailwind como equivalentes)
 * PRIORIZA AS CLASSES DO SEGUNDO PARÂMETRO.
 *
 * @param classes1 - String base que terá as classes substituídas
 * @param classes2 - String com as classes que irão substituir as equivalentes
 * @returns String com as classes resultantes (classe do segundo prevalece)
 *
 * @example
 * // w-auto é substituído por w-12
 * mergeClasses("w-auto h-4", "w-12") // "w-12 h-4"
 */
export const mergeClasses = (classes1: string, classes2: string): string => {
  const arr1 = classes1.trim().split(/\s+/).filter(Boolean);
  const arr2 = classes2.trim().split(/\s+/).filter(Boolean);

  // Remove de arr1 as classes que têm equivalente em arr2
  const classes1Filtradas = arr1.filter((class1) => {
    return !arr2.some((class2) => areSameUtility(class1, class2));
  });

  // Junta as classes filtradas do primeiro com todas as classes do segundo
  const result = [...classes1Filtradas, ...arr2];

  return result.join(" ");
};
