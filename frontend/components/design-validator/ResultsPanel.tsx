'use client';

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ResultsTable from './ResultsTable';
import { ValidationResponse } from '@/types/validation.types';

interface ResultsPanelProps {
    results: ValidationResponse | null;
    loading: boolean;
    error: string | null;
    onViewReasoning: () => void;
}

export default function ResultsPanel({
    results,
    loading,
    error,
    onViewReasoning,
}: ResultsPanelProps) {
    if (loading) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress sx={{ color: '#4CAF50' }} />
                <Typography variant="body1" sx={{ mt: 2, color: '#666' }}>
                    Validating cable design...
                </Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Paper>
        );
    }

    if (!results) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                    No Results Yet
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                    Enter cable design details and click Validate to see results
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                        Validation Results
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
                        Overall Confidence: {(results.confidence.overall * 100).toFixed(0)}%
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={onViewReasoning}
                    sx={{
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                            borderColor: '#2E7D32',
                            backgroundColor: 'rgba(76, 175, 80, 0.04)',
                        },
                    }}
                >
                    View AI Reasoning
                </Button>
            </Box>

            <ResultsTable validations={results.validation} />
        </Paper>
    );
}
