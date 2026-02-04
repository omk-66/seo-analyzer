// Image Alt Attributes Analysis Types
export interface ImageAltAnalysis {
    totalImages: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    missingPercentage: number;
    status: 'good' | 'warning' | 'error';
    message: string;
    images: Array<{
        src: string;
        alt?: string;
        hasAlt: boolean;
    }>;
}

// Image Alt Attributes Analysis Function
export function analyzeImageAltAttributes(
    images: Array<{ src: string; alt?: string; hasAlt?: boolean }>
): ImageAltAnalysis {
    // Ensure images is always an array
    const safeImages = Array.isArray(images) ? images : [];

    // Process images to ensure hasAlt is set
    const processedImages = safeImages.map(img => ({
        src: img.src,
        alt: img.alt,
        hasAlt: img.hasAlt ?? (!!img.alt && img.alt.trim() !== '')
    }));

    const totalImages = processedImages.length;
    const imagesWithAlt = processedImages.filter(img => img.hasAlt).length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const missingPercentage = totalImages > 0 ? Math.round((imagesWithoutAlt / totalImages) * 100) : 0;

    if (imagesWithoutAlt === 0) {
        return {
            totalImages,
            imagesWithAlt,
            imagesWithoutAlt,
            missingPercentage: 0,
            status: 'good',
            message: `You do not have any images missing Alt Attributes on your page. All ${totalImages} images have proper alt text.`,
            images: processedImages,
        };
    }

    if (missingPercentage <= 50) {
        return {
            totalImages,
            imagesWithAlt,
            imagesWithoutAlt,
            missingPercentage,
            status: 'warning',
            message: `${imagesWithoutAlt} image(s) on your page are missing Alt Attributes (${missingPercentage}% of total). Adding alt text improves accessibility and SEO.`,
            images: processedImages,
        };
    }

    return {
        totalImages,
        imagesWithAlt,
        imagesWithoutAlt,
        missingPercentage,
        status: 'error',
        message: `${imagesWithoutAlt} image(s) on your page are missing Alt Attributes (${missingPercentage}% of total). This significantly impacts accessibility and SEO.`,
        images: processedImages,
    };
}
