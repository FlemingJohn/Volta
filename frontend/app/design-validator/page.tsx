'use client';

import React, { useState } from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import InputPanel from '@/components/design-validator/InputPanel';
import ResultsPanel from '@/components/design-validator/ResultsPanel';
import ReasoningDrawer from '@/components/design-validator/ReasoningDrawer';
import { validationApi } from '@/services/validation-api.service';
import { ValidationResponse, ValidationRequest } from '@/types/validation.types';

export default function DesignValidatorPage() {
    const [results, setResults] = useState<ValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleValidate = async (data: ValidationRequest) => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await validationApi.validateDesign(data);
            setResults(response);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Validation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 600,
                        color: '#2E7D32',
                        mb: 1,
                    }}
                >
                    Cable Design Validator
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    AI-powered validation against IEC 60502-1 and IEC 60228 standards
                </Typography>
            </Box>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <InputPanel onValidate={handleValidate} loading={loading} />
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                    <ResultsPanel
                        results={results}
                        loading={loading}
                        error={error}
                        onViewReasoning={() => setDrawerOpen(true)}
                    />
                </Grid>
            </Grid>

            <ReasoningDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                aiReasoning={results?.aiReasoning}
                confidence={results?.confidence?.overall ?? 0}
            />
        </Container>
    );
}
