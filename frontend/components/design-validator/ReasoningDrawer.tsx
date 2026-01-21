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
import ReactMarkdown from 'react-markdown';

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
            <Box sx={{ width: 450, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                        AI Reasoning
                    </Typography>
                    <Box sx={{
                        px: 1,
                        py: 0.5,
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '1px solid #C8E6C9'
                    }}>
                        IEC STANDARDS GROUNDED
                    </Box>
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

                <Box sx={{
                    '& h1, & h2, & h3': { color: '#2E7D32', mt: 2, mb: 1, fontSize: '1.1rem' },
                    '& p': { color: '#555', mb: 1.5, fontSize: '0.9rem', lineHeight: 1.6 },
                    '& ul, & ol': { pl: 2, mb: 2, color: '#555' },
                    '& li': { mb: 0.5, fontSize: '0.9rem' },
                    '& strong': { color: '#333' }
                }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Solution Based on IEC Standards
                    </Typography>
                    {aiReasoning ? (
                        <ReactMarkdown>{aiReasoning}</ReactMarkdown>
                    ) : (
                        <Typography variant="body2" sx={{ color: '#999', fontStyle: 'italic' }}>
                            No technical justification provided.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
}
