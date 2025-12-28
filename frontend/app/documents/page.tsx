"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Table, Column } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge, RiskBadge } from '@/components/ui/badge';
import { Search, Filter, Download, Upload, Trash2, MoreVertical, Eye, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Document {
    id: string;
    name: string;
    source: string;
    type: string;
    uploadedBy: string;
    uploadDate: string;
    size: string;
    status: 'indexed' | 'queued' | 'error' | 'pending';
    chunks: number;
    lastUsed: string;
    tags: string[];
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    url?: string;
}

export default function Documents() {
    const { data: session } = useSession();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSource, setFilterSource] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/documents');
            const mappedDocs: Document[] = response.data.map((doc: any) => ({
                id: doc.id,
                name: doc.name,
                source: 'Supabase', // Default for now
                type: doc.type,
                uploadedBy: session?.user?.name || 'Demo User',
                uploadDate: new Date(doc.createdAt).toLocaleDateString(),
                size: formatBytes(doc.size),
                status: doc.status,
                chunks: doc._count?.chunks || 0,
                lastUsed: new Date(doc.updatedAt).toLocaleDateString(), // Placeholder
                tags: [], // TODO: Add tags to DB
                riskLevel: doc.riskLevel,
                url: doc.url
            }));
            setDocuments(mappedDocs);
        } catch (error) {
            console.error("Failed to fetch documents", error);
            toast.error("Failed to load documents");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [session]);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

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
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-medium text-text-primary truncate hover:underline">{doc.name}</a>
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
                const variants: Record<string, "success" | "warning" | "danger" | "neutral"> = {
                    indexed: 'success',
                    queued: 'warning',
                    pending: 'warning',
                    processing: 'warning',
                    error: 'danger'
                };
                return <Badge variant={variants[doc.status] || 'neutral'} size="sm" dot>{doc.status}</Badge>;
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
                    <button className="p-1.5 hover:bg-surface-a20 rounded transition-colors" title="View" onClick={() => window.open(doc.url, '_blank')}>
                        <Eye className="w-4 h-4 text-text-secondary" />
                    </button>
                    <button className="p-1.5 hover:bg-surface-a20 rounded transition-colors" title="Download" onClick={() => window.open(doc.url, '_blank')}>
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
        let result = documents.filter(doc => {
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
    }, [documents, searchQuery, filterSource, filterStatus, sortColumn, sortDirection]);

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            const toastId = toast.loading(`Uploading ${file.name}...`);

            try {
                await axios.post('/api/documents/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success(`${file.name} uploaded successfully`, { id: toastId });
                fetchDocuments(); // Refresh list
            } catch (error) {
                console.error("Upload failed", error);
                toast.error("Upload failed", { id: toastId });
            }

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
                        { value: 'Local', label: 'Local' },
                        { value: 'Supabase', label: 'Supabase' }
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
                        { value: 'pending', label: 'Pending' },
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
                Showing {filteredDocuments.length} documents
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <Table
                    columns={columns}
                    data={filteredDocuments}
                    selectable
                    emptyMessage={loading ? "Loading documents..." : "No documents found"}
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
    const statusColors: Record<string, "success" | "warning" | "danger" | "neutral"> = {
        indexed: 'success',
        queued: 'warning',
        pending: 'warning',
        processing: 'warning',
        error: 'danger'
    };

    return (
        <div className="bg-surface-a10 dark:bg-surface-a20 rounded-lg border border-surface-a30 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => document.url && window.open(document.url, '_blank')}>
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
                <Badge variant={statusColors[document.status] || 'neutral'} size="sm" dot>
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
