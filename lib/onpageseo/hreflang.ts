// Hreflang Analysis Types
export interface HreflangAnalysis {
    hasHreflang: boolean;
    hreflangEntries: string[];
    status: 'good' | 'warning' | 'error';
    message: string;
}

// Hreflang Analysis Function
export function analyzeHreflang(hreflangEntries: string[]): HreflangAnalysis {
    if (!hreflangEntries || hreflangEntries.length === 0) {
        return {
            hasHreflang: false,
            hreflangEntries: [],
            status: 'warning',
            message: 'Your page is not making use of Hreflang attributes. Hreflang tags help search engines show the correct language/content for your users.',
        };
    }

    return {
        hasHreflang: true,
        hreflangEntries,
        status: 'good',
        message: `Your page uses ${hreflangEntries.length} Hreflang attribute(s) for language/regional targeting.`,
    };
}
