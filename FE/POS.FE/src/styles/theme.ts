import { colors } from "./tokens/colors";
import { fonts } from "./tokens/fronts";
import { sizes } from "./tokens/sizes";

export const theme = {
  colors,
  fonts,
  sizes,
} as const;

export type Theme = typeof theme;

export default theme;

