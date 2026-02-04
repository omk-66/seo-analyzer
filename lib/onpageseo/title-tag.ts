// Title Tag Analysis Types
export interface TitleTagAnalysis {
    exists: boolean;
    title: string;
    length: number;
    isOptimalLength: boolean;
    minLength: number;
    maxLength: number;
    status: 'good' | 'warning' | 'error';
    message: string;
}

// Title Tag Analysis Function
export function analyzeTitleTag(title: string): TitleTagAnalysis {
    const minLength = 50;
    const maxLength = 60;
    const length = title.length;

    if (!title || title.trim() === '') {
        return {
            exists: false,
            title: '',
            length: 0,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'error',
            message: 'Your page is missing a Title Tag. Title tags are crucial for search engines to understand your page content.',
        };
    }

    if (length < minLength) {
        return {
            exists: true,
            title,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Title Tag is too short (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces).`,
        };
    }

    if (length > maxLength) {
        return {
            exists: true,
            title,
            length,
            isOptimalLength: false,
            minLength,
            maxLength,
            status: 'warning',
            message: `Your Title Tag is too long (${length} characters). It should be between ${minLength} and ${maxLength} characters (including spaces) to avoid truncation in search results.`,
        };
    }

    return {
        exists: true,
        title,
        length,
        isOptimalLength: true,
        minLength,
        maxLength,
        status: 'good',
        message: `Your Title Tag length is optimal (${length} characters).`,
    };
}
