import { createTheme } from '@mui/material/styles';

export const typographyVariants = {
  // title variants
  'title-large': { fontSize: '22px', fontWeight: 400, lineHeight: '28px' },
  'title-large-medium': {
    fontSize: '22px',
    fontWeight: 500,
    lineHeight: '28px',
  },
  'title-medium-bold': {
    fontSize: '16px',
    fontWeight: 700,
    lineHeight: '24px',
  },
  'title-medium': { fontSize: '16px', fontWeight: 500, lineHeight: '24px' },
  'title-small-bold': { fontSize: '14px', fontWeight: 700, lineHeight: '20px' },
  'title-small': { fontSize: '14px', fontWeight: 500, lineHeight: '20px' },
  'title-too-small': { fontSize: '12px', fontWeight: 700, lineHeight: '20px' },
  'title-too-small-bold': {
    fontSize: '12px',
    fontWeight: 700,
    lineHeight: '20px',
  },

  // body variants
};

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'IRANSansX',
    // title: typographyVariants,
    ...typographyVariants,
  },
});

export default theme;
