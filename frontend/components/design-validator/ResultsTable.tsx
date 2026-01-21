'use client';

import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import StatusChip from './StatusChip';
import { FieldValidation } from '@/types/validation.types';

interface ResultsTableProps {
    validations: FieldValidation[];
}

export default function ResultsTable({ validations }: ResultsTableProps) {
    const columns: GridColDef[] = [
        {
            field: 'field',
            headerName: 'Attribute',
            flex: 1,
            minWidth: 150,
        },
        {
            field: 'provided',
            headerName: 'Provided',
            flex: 1,
            minWidth: 120,
            valueFormatter: (value) => value ?? 'N/A',
        },
        {
            field: 'expected',
            headerName: 'Expected',
            flex: 1,
            minWidth: 120,
            valueFormatter: (value) => value ?? 'N/A',
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => <StatusChip status={params.value} size="small" />,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 2,
            minWidth: 300,
            renderCell: (params) => (
                <Box sx={{
                    whiteSpace: 'normal',
                    lineHeight: '1.5',
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%'
                }}>
                    {params.value}
                </Box>
            ),
        },
    ];

    const rows = validations.map((validation, index) => ({
        id: index,
        ...validation,
    }));

    return (
        <Box sx={{ width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                autoHeight
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 70}
                disableRowSelectionOnClick
                sx={{
                    border: '1px solid #E8E8E8',
                    borderRadius: 2,
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#F5F5F5',
                        fontWeight: 600,
                    },
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #F0F0F0',
                    },
                }}
                initialState={{
                    pagination: {
                        paginationModel: { pageSize: 10 },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
            />
        </Box>
    );
}
