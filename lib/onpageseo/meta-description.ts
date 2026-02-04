// Meta Description Analysis Types
export interface MetaDescriptionAnalysis {
    exists: boolean;
    description: string;
    length: number;
    isOptimalLength: boolean;
    minLength: number;
    maxLength: number;
    status: 'good' | 'warning' | 'error';
    message: string;
}

// Meta Description Analysis Function
export function analyzeMetaDescription(metaDescription: string): MetaDescriptionAnalysis {
    const minLength = 120;
    const maxLength = 160;
    const length = metaDescription.length;

    if (!metaDescription || metaDescription.trim() === '') {
        return {
            exists: false,
            description: '',
            length: 0,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'error',
            message: 'Your page is missing a Meta Description. Meta descriptions are important for search engines to understand your page content.',
        };
    }

    if (length < minLength) {
        return {
            exists: true,
            description: metaDescription,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Meta Description is too short (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces).`,
        };
    }

    if (length > maxLength) {
        return {
            exists: true,
            description: metaDescription,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Meta Description is too long (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces) to avoid truncation in search results.`,
        };
    }

    return {
        exists: true,
        description: metaDescription,
        length,
        isOptimalLength: true,
        minLength,
        maxLength,
        status: 'good',
        message: `Your Meta Description length is optimal (${length} characters).`,
    };
}
