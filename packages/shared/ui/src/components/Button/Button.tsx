import { FC } from 'react';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

const Button: FC<MuiButtonProps> = (props) => <MuiButton {...props} />;

export default Button;
