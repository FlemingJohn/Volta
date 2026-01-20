'use client';

import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    LinearProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ReasoningDrawerProps {
    open: boolean;
    onClose: () => void;
    aiReasoning?: string;
    confidence: number;
}

export default function ReasoningDrawer({
    open,
    onClose,
    aiReasoning,
    confidence,
}: ReasoningDrawerProps) {
    const getConfidenceColor = () => {
        if (confidence >= 0.8) return '#4CAF50';
        if (confidence >= 0.6) return '#FFA726';
        return '#EF5350';
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                        AI Reasoning
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Confidence Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress
                            variant="determinate"
                            value={confidence * 100}
                            sx={{
                                flex: 1,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#E8E8E8',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: getConfidenceColor(),
                                    borderRadius: 4,
                                },
                            }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: getConfidenceColor() }}>
                            {(confidence * 100).toFixed(0)}%
                        </Typography>
                    </Box>
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                        Detailed Explanation
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            color: '#666',
                            lineHeight: 1.6,
                        }}
                    >
                        {aiReasoning || 'No reasoning available'}
                    </Typography>
                </Box>
            </Box>
        </Drawer>
    );
}
