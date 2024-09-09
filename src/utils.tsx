import { AI, environment } from "@raycast/api";

export enum CodeElementType {
  Variable = "Variable",
  Function = "Function",
  Class = "Class",
  File = "File",
  Constant = "Constant",
  Type = "Type",
}

export enum NamingStyle {
  CamelCase = "camelCase",
  PascalCase = "PascalCase",
  SnakeCase = "snake_case",
  KebabCase = "kebab-case",
  UpperCase = "UPPER_CASE",
}

export function isNamingStyle(value: string): boolean {
  return Object.values(NamingStyle).includes(value as NamingStyle);
}

export function convertStringNamingStyle(value: string): NamingStyle {
  switch (value) {
    case "camelCase":
      return NamingStyle.CamelCase;
    case "PascalCase":
      return NamingStyle.PascalCase;
    case "snake_case":
      return NamingStyle.SnakeCase;
    case "kebab-case":
      return NamingStyle.KebabCase;
    case "UPPER_CASE":
      return NamingStyle.UpperCase;
    default:
      console.log("fuck...");
      return NamingStyle.CamelCase;
  }
}

export async function generateNameSuggestions(
  elementType: CodeElementType,
  description: string,
  style: string,
): Promise<string[]> {
  if (!environment.canAccess(AI)) {
    throw new Error("Failed to generate name suggestions. Please try again.");
  }

  const prompt = `As an expert programmer, generate three concise and optimized ${style} names for a ${elementType.toLowerCase()} based on this description: "${description}".
  
  Guidelines:
  1. Prioritize clarity and brevity.
  2. Avoid redundant words or overly verbose names.
  3. Capture the essence of the functionality in as few words as possible.
  4. Strictly adhere to the ${style} naming convention.
  5. Ensure names are intuitive and self-explanatory.
  6. Aim for names no longer than 2-3 words or compound terms.
  7. Use common programming abbreviations if they enhance brevity without sacrificing clarity.

  Return only the three names in a comma-separated format: name1,name2,name3
  Do not include any other text, punctuation, or explanation.
  The names should be sorted by recommendation, with the best suggestion first.`;

  try {
    const response = await AI.ask(prompt, { model: AI.Model["OpenAI_GPT4o-mini"] });
    const suggestions = response.trim().split(",");

    if (suggestions.length !== 3) {
      throw new Error("Invalid number of suggestions received");
    }

    return suggestions.map((name) => name.trim());
  } catch (error) {
    console.error("Error generating name suggestions:", error);
    throw new Error("Failed to generate name suggestions. Please try again.");
  }
}