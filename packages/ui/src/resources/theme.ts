import { createTheme } from '@mui/material/styles';

export const typographyVariants = {
  large: { fontSize: '22px', fontWeight: 400, lineHeight: '28px' },
  'large-medium': { fontSize: '22px', fontWeight: 500, lineHeight: '28px' },
  'medium-bold': { fontSize: '16px', fontWeight: 700, lineHeight: '24px' },
  medium: { fontSize: '16px', fontWeight: 500, lineHeight: '24px' },
  'small-bold': { fontSize: '14px', fontWeight: 700, lineHeight: '20px' },
  small: { fontSize: '14px', fontWeight: 500, lineHeight: '20px' },
  'too-small': { fontSize: '12px', fontWeight: 700, lineHeight: '20px' },
  'too-small-bold': { fontSize: '12px', fontWeight: 700, lineHeight: '20px' },
};

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'IRANSansX',
    // title: typographyVariants,
    ...typographyVariants
  },
});

export default theme;
