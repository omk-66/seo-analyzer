import axios from "axios";

export interface ReferralDomainItem {
    refdomain: string;
    backlinks: number;
    dofollow_backlinks: number;
    first_seen: string; // ISO date string
    domain_inlink_rank: number;
}

export interface TLDStats {
    tld: string;
    count: number;
    percentage: number;
}

export interface ReferralDomainsApiResponse {
    referrers: ReferralDomainItem[];
    totalDomains: number;
    totalBacklinks: number;
    tldBreakdown: TLDStats[];
}

/**
 * Extract TLD from a domain
 */
export const extractTLD = (domain: string): string => {
    const parts = domain.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'unknown';
};

/**
 * Calculate TLD breakdown from referral domains
 */
export const calculateTLDStats = (referrers: ReferralDomainItem[]): TLDStats[] => {
    const tldCount: Record<string, number> = {};

    referrers.forEach(item => {
        const tld = extractTLD(item.refdomain);
        tldCount[tld] = (tldCount[tld] || 0) + 1;
    });

    const total = referrers.length;
    const stats: TLDStats[] = Object.entries(tldCount)
        .map(([tld, count]) => ({
            tld,
            count,
            percentage: total > 0 ? (count / total) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

    return stats;
};

/**
 * Get Referral Domains
 */
export const getReferralDomains = async (
    website: string,
    apiKey: string
): Promise<ReferralDomainsApiResponse> => {
    try {
        const response = await axios.get<ReferralDomainsApiResponse>(
            "https://vebapi.com/api/seo/referraldomains",
            {
                params: { website },
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                },
            }
        );

        // Calculate TLD breakdown on the client side if not provided by API
        const referrers = response.data.referrers || [];
        const totalDomains = referrers.length;
        const totalBacklinks = referrers.reduce((sum, item) => sum + item.backlinks, 0);
        const tldBreakdown = calculateTLDStats(referrers);

        return {
            ...response.data,
            referrers,
            totalDomains,
            totalBacklinks,
            tldBreakdown
        };
    } catch (error: any) {
        console.error(
            "Error fetching referral domains:",
            error.response?.data || error.message
        );
        throw error;
    }
};
