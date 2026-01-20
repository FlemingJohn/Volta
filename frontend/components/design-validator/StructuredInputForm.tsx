'use client';

import React from 'react';
import {
    Box,
    TextField,
    Grid,
    MenuItem,
} from '@mui/material';
import { StructuredInput } from '@/types/validation.types';

interface StructuredInputFormProps {
    formData: StructuredInput;
    onChange: (data: StructuredInput) => void;
}

export default function StructuredInputForm({ formData, onChange }: StructuredInputFormProps) {
    const handleChange = (field: keyof StructuredInput, value: any) => {
        onChange({ ...formData, [field]: value });
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Standard"
                        value={formData.standard || ''}
                        onChange={(e) => handleChange('standard', e.target.value)}
                        placeholder="e.g., IEC 60502-1"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Voltage"
                        value={formData.voltage || ''}
                        onChange={(e) => handleChange('voltage', e.target.value)}
                        placeholder="e.g., 0.6/1 kV"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        select
                        label="Conductor Material"
                        value={formData.conductorMaterial || ''}
                        onChange={(e) => handleChange('conductorMaterial', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Cu">Copper (Cu)</MenuItem>
                        <MenuItem value="Al">Aluminum (Al)</MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        select
                        label="Conductor Class"
                        value={formData.conductorClass || ''}
                        onChange={(e) => handleChange('conductorClass', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="Class 1">Class 1</MenuItem>
                        <MenuItem value="Class 2">Class 2</MenuItem>
                        <MenuItem value="Class 5">Class 5</MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Cross-Sectional Area (mm²)"
                        value={formData.csa || ''}
                        onChange={(e) => handleChange('csa', parseFloat(e.target.value) || undefined)}
                        placeholder="e.g., 10"
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        select
                        label="Insulation Material"
                        value={formData.insulationMaterial || ''}
                        onChange={(e) => handleChange('insulationMaterial', e.target.value)}
                    >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="PVC">PVC</MenuItem>
                        <MenuItem value="XLPE">XLPE</MenuItem>
                        <MenuItem value="EPR">EPR</MenuItem>
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Insulation Thickness (mm)"
                        value={formData.insulationThickness || ''}
                        onChange={(e) => handleChange('insulationThickness', parseFloat(e.target.value) || undefined)}
                        placeholder="e.g., 1.0"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}
