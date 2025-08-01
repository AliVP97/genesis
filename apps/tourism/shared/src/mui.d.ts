import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    'title-too-small-bold': React.CSSProperties;
    'title-small': React.CSSProperties;
    'title-small-bold': React.CSSProperties;
    'title-medium': React.CSSProperties;
    'title-medium-bold': React.CSSProperties;
    'title-large': React.CSSProperties;
    'title-large-medium': React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    'title-too-small-bold'?: React.CSSProperties;
    'title-small'?: React.CSSProperties;
    'title-small-bold'?: React.CSSProperties;
    'title-medium'?: React.CSSProperties;
    'title-medium-bold'?: React.CSSProperties;
    'title-large'?: React.CSSProperties;
    'title-large-medium'?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    'title-too-small-bold': true;
    'title-small': true;
    'title-small-bold': true;
    'title-medium': true;
    'title-medium-bold': true;
    'title-large': true;
    'title-large-medium': true;
  }
}

export {};
