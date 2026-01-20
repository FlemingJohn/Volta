'use client';

import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

interface FreeTextInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default function FreeTextInput({ value, onChange }: FreeTextInputProps) {
    return (
        <Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Enter cable design specifications in natural language. The AI will extract and validate the parameters.
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={8}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder='Example: "IEC 60502-1 cable, 10 sqmm Cu Class 2, PVC insulation 1.0 mm, LV 0.6/1 kV"'
                sx={{
                    '& .MuiOutlinedInput-root': {
                        fontFamily: 'monospace',
                    },
                }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#999' }}>
                {value.length} characters
            </Typography>
        </Box>
    );
}
