// Content Amount Analysis Types
export interface ContentAmountAnalysis {
    wordCount: number;
    status: 'good' | 'warning' | 'error';
    message: string;
    minWords: number;
    maxWords: number;
}

// Content Amount Analysis Function
export function analyzeContentAmount(wordCount: number): ContentAmountAnalysis {
    const minWords = 300;
    const maxWords = 3500;

    if (wordCount < minWords) {
        return {
            wordCount,
            status: 'warning',
            message: `Your page has ${wordCount} words, which is below the recommended minimum of ${minWords} words. Adding more content can improve your ranking potential.`,
            minWords,
            maxWords,
        };
    }

    if (wordCount > maxWords) {
        return {
            wordCount,
            status: 'warning',
            message: `Your page has ${wordCount} words, which exceeds the recommended maximum of ${maxWords} words. Consider breaking up lengthy content into multiple pages.`,
            minWords,
            maxWords,
        };
    }

    return {
        wordCount,
        status: 'good',
        message: `Your page has a good level of textual content (${wordCount} words), which will assist in its ranking potential.`,
        minWords,
        maxWords,
    };
}
