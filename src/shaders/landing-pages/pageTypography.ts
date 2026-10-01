export type PageFont = {
  value: string;
  label: string;
  stack: string;
  google?: string;
};

export const INSTRUMENT_SERIF: PageFont = { value: "instrument-serif", label: "Instrument Serif", stack: "serif" };
export const NEWSREADER: PageFont = { value: "newsreader", label: "Newsreader", stack: "serif" };
export const GEIST: PageFont = { value: "geist", label: "Geist", stack: "sans-serif" };

export type PageTypographyProps = {
  headingFont?: string;
  bodyFont?: string;
  headingWeight?: string;
  bodyWeight?: string;
  primaryColor?: string;
  headingSize?: number;
  bodySize?: number;
  headingLetterSpacing?: number;
};

export type PageTypography = {
  heading: string;
  body: string;
  headingWeight: string;
  bodyWeight: string;
  primary: string;
  headingSize: number;
  bodySize: number;
  headingLetterSpacing: number;
  retone: (hex: string) => string;
  retoneRgba: (color: string) => string;
  filter: (baseHex?: string) => string;
};

export type PageInlineStyleOverride = {
  selector: string;
  styles: Readonly<Record<string, string>>;
};

export type PageTypographyRecipe = {
  headingFonts: readonly PageFont[];
  bodyFonts: readonly PageFont[];
  headingWeights: readonly string[];
  headingWeight: string;
  bodyWeights: readonly string[];
  bodyWeight: string;
  primaryColor: `#${string}`;
  headingSize: readonly [number, number, number];
  bodySize: readonly [number, number, number];
  headingLetterSpacing: readonly [number, number, number];
  css: (type: PageTypography) => string;
  inlineStyles?: (type: PageTypography) => readonly PageInlineStyleOverride[];
};

export type LandingPageCustomization = {
  css: string;
  fontHref?: string;
  inlineStyles?: readonly PageInlineStyleOverride[];
};

export function splitTypographyProps<T extends PageTypographyProps>(
  props: T
): readonly [PageTypographyProps, Omit<T, keyof PageTypographyProps>] {
  const {
    headingFont,
    bodyFont,
    headingWeight,
    bodyWeight,
    primaryColor,
    headingSize,
    bodySize,
    headingLetterSpacing,
    ...rest
  } = props;
  return [
    {
      headingFont,
      bodyFont,
      headingWeight,
      bodyWeight,
      primaryColor,
      headingSize,
      bodySize,
      headingLetterSpacing,
    },
    rest as Omit<T, keyof PageTypographyProps>,
  ];
}

export function usePageTypography(
  _recipe: any,
  _props: PageTypographyProps
): LandingPageCustomization {
  return { css: "" };
}

export const PAGE_CUSTOMIZATION_BRIDGE = "";

export function postPageCustomization(
  _frame: HTMLIFrameElement | null,
  _customization?: LandingPageCustomization
): void {}

export function applyPageCustomization(
  _frame: HTMLIFrameElement | null,
  _customization?: LandingPageCustomization
): void {}
