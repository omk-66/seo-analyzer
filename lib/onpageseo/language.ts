import ISO6391 from 'iso-639-1';


// Language Analysis Types
export interface LanguageAnalysis {
    hasLangAttribute: boolean;
    declaredLanguage: string | null;
    status: 'good' | 'warning' | 'error';
    message: string;
}

// Language Analysis Function
export function analyzeLanguage(langAttribute: string | undefined | null): LanguageAnalysis {
    if (!langAttribute || langAttribute.trim() === '') {
        return {
            hasLangAttribute: false,
            declaredLanguage: null,
            status: 'warning',
            message: 'Your page is not using the Lang Attribute. Declaring a language helps search engines and assistive technologies understand your content.',
        };
    }

    const isValidLanguage = ISO6391.validate(langAttribute);
    const languageName = ISO6391.getName(langAttribute);

    return {
        hasLangAttribute: true,
        declaredLanguage: languageName,
        status: isValidLanguage ? 'good' : 'warning',
        message: `Your page is using the Lang Attribute.`,
    };
}
