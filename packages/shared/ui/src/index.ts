// Core providers
// MUI Components - Import and re-export individually to avoid SSR issues
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

export { UIProvider } from './resources';

// Tokens
export { default as colors } from './resources/colors';

export {
  // Layout
  Box,
  Container,
  Grid,
  Stack,
  // Inputs
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  // Data Display
  Typography,
  // Feedback
  CircularProgress,
};

// Hooks
export { useTheme, styled } from '@mui/material/styles';

// Client-side hooks
export { useMediaQuery } from './hooks/useMediaQuery';
