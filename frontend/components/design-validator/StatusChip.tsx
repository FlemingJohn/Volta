'use client';

import React from 'react';
import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { ValidationStatus } from '@/types/validation.types';

interface StatusChipProps {
    status: ValidationStatus;
    size?: 'small' | 'medium';
}

export default function StatusChip({ status, size = 'medium' }: StatusChipProps) {
    const getChipProps = () => {
        switch (status) {
            case 'PASS':
                return {
                    label: 'PASS',
                    color: '#4CAF50' as const,
                    icon: <CheckCircleIcon />,
                };
            case 'WARN':
                return {
                    label: 'WARN',
                    color: '#FFA726' as const,
                    icon: <WarningIcon />,
                };
            case 'FAIL':
                return {
                    label: 'FAIL',
                    color: '#EF5350' as const,
                    icon: <ErrorIcon />,
                };
        }
    };

    const { label, color, icon } = getChipProps();

    return (
        <Chip
            label={label}
            icon={icon}
            size={size}
            sx={{
                backgroundColor: color,
                color: '#FFFFFF',
                fontWeight: 600,
                '& .MuiChip-icon': {
                    color: '#FFFFFF',
                },
            }}
        />
    );
}
