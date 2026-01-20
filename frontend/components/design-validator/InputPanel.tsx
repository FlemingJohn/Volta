'use client';

import React, { useState } from 'react';
import {
    Box,
    Paper,
    Tabs,
    Tab,
    Button,
    Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StructuredInputForm from './StructuredInputForm';
import FreeTextInput from './FreeTextInput';
import { StructuredInput } from '@/types/validation.types';

interface InputPanelProps {
    onValidate: (data: { structuredInput?: StructuredInput; freeTextInput?: string }) => void;
    loading: boolean;
}

export default function InputPanel({ onValidate, loading }: InputPanelProps) {
    const [tabValue, setTabValue] = useState(0);
    const [structuredData, setStructuredData] = useState<StructuredInput>({});
    const [freeText, setFreeText] = useState('');

    const handleValidate = () => {
        if (tabValue === 0) {
            onValidate({ structuredInput: structuredData });
        } else {
            onValidate({ freeTextInput: freeText });
        }
    };

    const isValidateDisabled = () => {
        if (loading) return true;
        if (tabValue === 0) {
            return Object.keys(structuredData).length === 0;
        }
        return !freeText.trim();
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#2E7D32' }}>
                Cable Design Input
            </Typography>

            <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 500,
                    },
                    '& .Mui-selected': {
                        color: '#4CAF50',
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: '#4CAF50',
                    },
                }}
            >
                <Tab label="Structured Input" />
                <Tab label="Free Text" />
            </Tabs>

            <Box sx={{ mb: 3 }}>
                {tabValue === 0 ? (
                    <StructuredInputForm formData={structuredData} onChange={setStructuredData} />
                ) : (
                    <FreeTextInput value={freeText} onChange={setFreeText} />
                )}
            </Box>

            <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleValidate}
                disabled={isValidateDisabled()}
                sx={{
                    backgroundColor: '#4CAF50',
                    '&:hover': {
                        backgroundColor: '#2E7D32',
                    },
                    '&:disabled': {
                        backgroundColor: '#E8E8E8',
                    },
                }}
            >
                {loading ? 'Validating...' : 'Validate Design'}
            </Button>
        </Paper>
    );
}
