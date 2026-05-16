// Todas maiúsculas
export const toUpperCase = (text: string): string => text.toUpperCase();

// Todas minúsculas
export const toLowerCase = (text: string): string => text.toLowerCase();

// Primeira letra maiúscula, resto minúscula
export const toCapitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// PascalCase (Exemplo: MeuNomeComposto)
export const toPascalCase = (text: string): string =>
  text
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

// camelCase (exemplo: meuNomeComposto)
export const toCamelCase = (text: string): string =>
  text
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");

// snake_case (exemplo: meu_nome_composto)
export const toSnakeCase = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "_");

// kebab-case (exemplo: meu-nome-composto)
export const toKebabCase = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[\s_-]+/g, "-");
