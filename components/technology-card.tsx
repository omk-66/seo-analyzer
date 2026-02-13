"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Globe, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface TechnologyData {
    serverIP?: {
        ipAddresses?: string[];
        status?: 'good' | 'warning' | 'error';
        message?: string;
    };
    dnsServers?: {
        dnsServers?: string[];
        status?: 'good' | 'warning' | 'error';
        message?: string;
    };
}

function getStatusColor(status?: string): string {
    switch (status) {
        case 'good': return 'bg-green-100 text-green-800 border-green-200';
        case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'error': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

export function TechnologyCard({ analysis }: { analysis?: TechnologyData | any }) {
    const [showInfo, setShowInfo] = useState(false);
    const serverIP = analysis?.serverIP;
    const dnsServers = analysis?.dnsServers;

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        Technology Results
                    </CardTitle>
                    {serverIP?.status === 'good' && dnsServers?.status === 'good' ? (
                        <div className="flex items-center gap-1 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-yellow-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Server IP Address */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(serverIP?.status)}>
                                {serverIP?.status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                            <span className="font-medium">Server IP Address</span>
                        </div>
                        <p className="text-sm text-gray-600">{serverIP?.message || 'No IP data available'}</p>
                        {serverIP?.ipAddresses && serverIP.ipAddresses.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {serverIP.ipAddresses.map((ip: string, idx: number) => (
                                    <div key={idx} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                        {ip}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* DNS Servers */}
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(dnsServers?.status)}>
                                {dnsServers?.status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                            <span className="font-medium">DNS Servers</span>
                        </div>
                        <p className="text-sm text-gray-600">{dnsServers?.message || 'No DNS data available'}</p>
                        {dnsServers?.dnsServers && dnsServers.dnsServers.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {dnsServers.dnsServers.map((server: string, idx: number) => (
                                    <div key={idx} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                        {server}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Collapsible Info Section */}
                    <div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowInfo(!showInfo)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                            <Info className="w-4 h-4" />
                            {showInfo ? 'Less Info' : 'More Info'}
                            {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${showInfo ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">About Server Technology</h4>
                                <p className="text-sm text-blue-800">
                                    Server IP Address and DNS information help identify where your website is hosted and how visitors connect to it.
                                </p>
                                <div className="mt-3 space-y-2 text-sm text-blue-700">
                                    <p>• <strong>Server IP:</strong> Identifies the server hosting your website</p>
                                    <p>• <strong>DNS Servers:</strong> Translate domain names to IP addresses</p>
                                    <p>• <strong>Importance:</strong> Affects website performance and reliability</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
