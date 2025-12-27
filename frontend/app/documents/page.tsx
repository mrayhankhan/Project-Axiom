"use client";

import React, { useState, useRef } from 'react';
import { Table, Column } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge, RiskBadge } from '@/components/ui/badge';
import { Search, Filter, Download, Upload, Trash2, MoreVertical, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Document {
    id: string;
    name: string;
    source: string;
    type: string;
    uploadedBy: string;
    uploadDate: string;
    size: string;
    status: 'indexed' | 'queued' | 'error';
    chunks: number;
    lastUsed: string;
    tags: string[];
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

const mockDocuments: Document[] = [
    {
        id: '1',
        name: 'Credit Risk Model Documentation v2.3.pdf',
        source: 'S3',
        type: 'PDF',
        uploadedBy: 'Sarah Chen',
        uploadDate: '2024-01-15',
        size: '2.4 MB',
        status: 'indexed',
        chunks: 142,
        lastUsed: '2 hours ago',
        tags: ['risk', 'model', 'credit'],
        riskLevel: 'low'
    },
    {
        id: '2',
        name: 'Underwriting Guidelines 2024.docx',
        source: 'SharePoint',
        type: 'DOCX',
        uploadedBy: 'John Doe',
        uploadDate: '2024-01-14',
        size: '1.8 MB',
        status: 'indexed',
        chunks: 98,
        lastUsed: '1 day ago',
        tags: ['underwriting', 'policy'],
        riskLevel: 'medium'
    },
    {
        id: '3',
        name: 'ML Model Explainability Framework.pdf',
        source: 'Local',
        type: 'PDF',
        uploadedBy: 'Alice Johnson',
        uploadDate: '2024-01-13',
        size: '3.2 MB',
        status: 'indexed',
        chunks: 187,
        lastUsed: '3 hours ago',
        tags: ['explainability', 'framework', 'ml'],
        riskLevel: 'low'
    },
    {
        id: '4',
        name: 'Regulatory Compliance Checklist.xlsx',
        source: 'Google Drive',
        type: 'XLSX',
        uploadedBy: 'System',
        uploadDate: '2024-01-12',
        size: '512 KB',
        status: 'queued',
        chunks: 0,
        lastUsed: 'Never',
        tags: ['compliance', 'regulatory'],
    },
    {
        id: '5',
        name: 'Model Risk Assessment Report Q4.pdf',
        source: 'S3',
        type: 'PDF',
        uploadedBy: 'Sarah Chen',
        uploadDate: '2024-01-11',
        size: '4.1 MB',
        status: 'indexed',
        chunks: 213,
        lastUsed: '5 days ago',
        tags: ['risk', 'assessment', 'q4'],
        riskLevel: 'high'
    },
    {
        id: '6',
        name: 'Training Data Dictionary.csv',
        source: 'Local',
        type: 'CSV',
        uploadedBy: 'John Doe',
        uploadDate: '2024-01-10',
        size: '256 KB',
        status: 'error',
        chunks: 0,
        lastUsed: 'Never',
        tags: ['data', 'training'],
    }
];

export default function Documents() {
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const columns: Column<Document>[] = [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (doc) => (
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-a30/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-a40" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-text-primary truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {doc.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'source',
            header: 'Source',
            sortable: true,
            width: '100px'
        },
        {
            key: 'uploadedBy',
            header: 'Uploaded By',
            sortable: true,
            width: '140px'
        },
        {
            key: 'uploadDate',
            header: 'Upload Date',
            sortable: true,
            width: '120px'
        },
        {
            key: 'size',
            header: 'Size',
            width: '100px'
        },
        {
            key: 'status',
            header: 'Status',
            width: '120px',
            render: (doc) => {
                const variants = {
                    indexed: 'success' as const,
                    queued: 'warning' as const,
                    error: 'danger' as const
                };
                return <Badge variant={variants[doc.status]} size="sm" dot>{doc.status}</Badge>;
            }
        },
        {
            key: 'chunks',
            header: 'Chunks',
            width: '80px'
        },
        {
            key: 'riskLevel',
            header: 'Risk',
            width: '140px',
            render: (doc) => doc.riskLevel ? <RiskBadge level={doc.riskLevel} /> : <span className="text-text-muted">—</span>
        },
        {
            key: 'actions',
            header: '',
            width: '100px',
            render: (doc) => (
                <div className="flex items-center gap-1">
                    <button className="p-1.5 hover:bg-surface-a20 rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button className="p-1.5 hover:bg-surface-a20 rounded transition-colors" title="Download">
                        <Download className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button className="p-1.5 hover:bg-surface-a20 rounded transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-text-secondary" />
                    </button>
                </div>
            )
        }
    ];

    const filteredDocuments = React.useMemo(() => {
        let result = mockDocuments.filter(doc => {
            const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSource = !filterSource || doc.source === filterSource;
            const matchesStatus = !filterStatus || doc.status === filterStatus;
            return matchesSearch && matchesSource && matchesStatus;
        });

        if (sortColumn) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortColumn];
                const bValue = (b as any)[sortColumn];

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [searchQuery, filterSource, filterStatus, sortColumn, sortDirection]);

    const handleSort = (column: string, direction: 'asc' | 'desc') => {
        setSortColumn(column);
        setSortDirection(direction);
    };

    const handleExport = () => {
        const headers = ['Name', 'Source', 'Uploaded By', 'Upload Date', 'Size', 'Status', 'Risk Level'];
        const csvContent = [
            headers.join(','),
            ...filteredDocuments.map(doc => [
                `"${doc.name}"`,
                doc.source,
                doc.uploadedBy,
                doc.uploadDate,
                doc.size,
                doc.status,
                doc.riskLevel || ''
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'documents_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Documents exported successfully');
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            toast.info(`Uploading ${file.name}...`, {
                description: "This is a demo. File will not be actually uploaded."
            });
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="space-y-6">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Input
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        showClear
                        onClear={() => setSearchQuery('')}
                        className="w-full sm:w-80"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        icon={<Download className="w-4 h-4" />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={<Upload className="w-4 h-4" />}
                        onClick={handleUploadClick}
                    >
                        Upload Documents
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Select
                    options={[
                        { value: 'S3', label: 'S3' },
                        { value: 'SharePoint', label: 'SharePoint' },
                        { value: 'Google Drive', label: 'Google Drive' },
                        { value: 'Local', label: 'Local' }
                    ]}
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    placeholder="All Sources"
                    className="w-40"
                />
                <Select
                    options={[
                        { value: 'indexed', label: 'Indexed' },
                        { value: 'queued', label: 'Queued' },
                        { value: 'error', label: 'Error' }
                    ]}
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    placeholder="All Statuses"
                    className="w-40"
                />
                <Button variant="tertiary" size="sm" icon={<Filter className="w-4 h-4" />}>
                    More Filters
                </Button>
                {(filterSource || filterStatus || searchQuery) && (
                    <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => {
                            setFilterSource('');
                            setFilterStatus('');
                            setSearchQuery('');
                        }}
                    >
                        Clear All
                    </Button>
                )}
                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('table')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            viewMode === 'table' ? 'bg-primary-a30/10 text-primary-a40' : 'text-text-muted hover:bg-surface-a20'
                        )}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2 rounded transition-colors",
                            viewMode === 'grid' ? 'bg-primary-a30/10 text-primary-a40' : 'text-text-muted hover:bg-surface-a20'
                        )}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-text-muted">
                Showing {filteredDocuments.length} of {mockDocuments.length} documents
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <Table
                    columns={columns}
                    data={filteredDocuments}
                    selectable
                    emptyMessage="No documents found"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
            )}
        </div>
    );
}

function DocumentCard({ document }: { document: Document }) {
    const statusColors = {
        indexed: 'success' as const,
        queued: 'warning' as const,
        error: 'danger' as const
    };

    return (
        <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-a30/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-a40" />
                </div>
                <button className="p-1 hover:bg-surface-a20 rounded">
                    <MoreVertical className="w-4 h-4 text-text-muted" />
                </button>
            </div>
            <h4 className="font-medium text-text-primary mb-2 truncate" title={document.name}>
                {document.name}
            </h4>
            <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Source:</span>
                    <span className="text-text-primary">{document.source}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Size:</span>
                    <span className="text-text-primary">{document.size}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Chunks:</span>
                    <span className="text-text-primary">{document.chunks}</span>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
                <Badge variant={statusColors[document.status]} size="sm" dot>
                    {document.status}
                </Badge>
                {document.riskLevel && <RiskBadge level={document.riskLevel} />}
            </div>
            <div className="flex flex-wrap gap-1">
                {document.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" size="sm">{tag}</Badge>
                ))}
            </div>
        </div>
    );
}
