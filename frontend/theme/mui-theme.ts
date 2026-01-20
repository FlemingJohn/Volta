'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#4CAF50',
            light: '#66BB6A',
            dark: '#2E7D32',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFFFFF',
            light: '#F5F5F5',
            dark: '#E8E8E8',
            contrastText: '#2E7D32',
        },
        success: {
            main: '#4CAF50',
        },
        warning: {
            main: '#FFA726',
        },
        error: {
            main: '#EF5350',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F5F5F5',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", sans-serif',
        h1: {
            fontWeight: 600,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 500,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        },
        body2: {
            fontWeight: 400,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: '1px solid #E8E8E8',
                    borderRadius: 8,
                },
            },
        },
    },
});

export default theme;
