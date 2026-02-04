// Header Tags Analysis Types
export interface HeaderTagAnalysis {
    hasH1: boolean;
    h1Tags: string[];
    headerFrequency: {
        h1: number;
        h2: number;
        h3: number;
        h4: number;
        h5: number;
        h6: number;
    };
    hasMultipleH1: boolean;
    status: 'good' | 'warning' | 'error';
    message: string;
}

// Header Tags Analysis Function
export function analyzeHeaderTags(
    h1Tags: string[],
    h2Tags: string[],
    h3Tags: string[],
    h4Tags: string[],
    h5Tags: string[],
    h6Tags: string[]
): HeaderTagAnalysis {
    // Ensure all inputs are arrays
    const safeH1 = Array.isArray(h1Tags) ? h1Tags : [];
    const safeH2 = Array.isArray(h2Tags) ? h2Tags : [];
    const safeH3 = Array.isArray(h3Tags) ? h3Tags : [];
    const safeH4 = Array.isArray(h4Tags) ? h4Tags : [];
    const safeH5 = Array.isArray(h5Tags) ? h5Tags : [];
    const safeH6 = Array.isArray(h6Tags) ? h6Tags : [];

    const headerFrequency = {
        h1: safeH1.length,
        h2: safeH2.length,
        h3: safeH3.length,
        h4: safeH4.length,
        h5: safeH5.length,
        h6: safeH6.length,
    };

    const hasMultipleH1 = h1Tags.length > 1;

    if (h1Tags.length === 0) {
        return {
            hasH1: false,
            h1Tags: [],
            headerFrequency,
            hasMultipleH1: false,
            status: 'error',
            message: 'Your page is missing an H1 Tag. H1 tags help search engines understand the main topic of your page.',
        };
    }

    if (hasMultipleH1) {
        return {
            hasH1: true,
            h1Tags,
            headerFrequency,
            hasMultipleH1: true,
            status: 'warning',
            message: `Your page has ${h1Tags.length} H1 Tags. Ideally, you should have only one H1 tag per page for better SEO structure.`,
        };
    }

    if (h2Tags.length > 0 || h3Tags.length > 0) {
        return {
            hasH1: true,
            h1Tags,
            headerFrequency,
            hasMultipleH1: false,
            status: 'good',
            message: `Your page has ${h1Tags.length} H1 Tag and uses multiple levels of Header Tags (H2: ${h2Tags.length}, H3: ${h3Tags.length}).`,
        };
    }

    return {
        hasH1: true,
        h1Tags,
        headerFrequency,
        hasMultipleH1: false,
        status: 'good',
        message: `Your page has ${h1Tags.length} H1 Tag.`,
    };
}
