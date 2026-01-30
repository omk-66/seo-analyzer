"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, EyeOff, Maximize2, Minimize2, Globe } from "lucide-react";

interface WebsitePreviewProps {
    url: string;
    title: string;
    content: string;
    onAnalyze: () => void;
    isAnalyzing: boolean;
}

export function WebsitePreview({ url, title, content, onAnalyze, isAnalyzing }: WebsitePreviewProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showContent, setShowContent] = useState(true);
    const [showIframe, setShowIframe] = useState(true);
    const [iframeError, setIframeError] = useState(false);

    const handleOpenInNewTab = () => {
        window.open(url, '_blank');
    };

    const handleIframeError = () => {
        setIframeError(true);
        setShowIframe(false);
    };

    const contentPreview = content.substring(0, 500) + (content.length > 500 ? "..." : "");

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Globe className="h-5 w-5" />
                        Website Preview
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                            {url}
                        </Badge>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowIframe(!showIframe)}
                                className="h-8 w-8 p-0"
                                title={showIframe ? "Hide Website" : "Show Website"}
                            >
                                <Globe className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowContent(!showContent)}
                                className="h-8 w-8 p-0"
                                title={showContent ? "Hide Content" : "Show Content"}
                            >
                                {showContent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="h-8 w-8 p-0"
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleOpenInNewTab}
                                className="h-8 w-8 p-0"
                                title="Open in New Tab"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </CardHeader>

            {!isMinimized && (
                <CardContent className="space-y-4">
                    {/* Website Title */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title || "No Title Found"}</h3>
                        <p className="text-sm text-gray-500 mb-4">{url}</p>
                    </div>

                    {/* Iframe Preview */}
                    {showIframe && !iframeError && (
                        <div className="border rounded-lg overflow-hidden bg-gray-100">
                            <div className="bg-gray-800 text-white px-3 py-2 text-xs font-mono flex items-center justify-between">
                                <span>Live Website Preview</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowIframe(false)}
                                    className="h-6 w-6 p-0 text-white hover:bg-gray-700"
                                >
                                    ×
                                </Button>
                            </div>
                            <iframe
                                src={url}
                                className="w-full h-96 border-0"
                                title={`Preview of ${url}`}
                                onLoad={() => setIframeError(false)}
                                onError={handleIframeError}
                                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                                loading="lazy"
                            />
                        </div>
                    )}

                    {/* Iframe Error Message */}
                    {iframeError && (
                        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">Preview Unavailable</h4>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        This website cannot be displayed in an iframe due to security restrictions.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIframeError(false);
                                        setShowIframe(true);
                                    }}
                                    className="text-xs"
                                >
                                    Retry
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Content Preview */}
                    {showContent && (
                        <div className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Content Preview:</h4>
                            <div className="text-sm text-gray-600 leading-relaxed">
                                {contentPreview || "No content available"}
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="flex justify-center pt-4">
                        <Button
                            onClick={onAnalyze}
                            disabled={isAnalyzing}
                            className="w-full max-w-md"
                            size="lg"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Analyzing SEO...
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Analyze SEO Performance
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">{content.length}</div>
                            <div className="text-xs text-gray-500">Characters</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-green-600">{content.split(/\s+/).filter(word => word.length > 0).length}</div>
                            <div className="text-xs text-gray-500">Words</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-semibold text-purple-600">{title.length}</div>
                            <div className="text-xs text-gray-500">Title Length</div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        <strong>Security Note:</strong> The website preview is displayed in a secure sandboxed iframe.
                        Some websites may prevent iframe embedding for security reasons.
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
