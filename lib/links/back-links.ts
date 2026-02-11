import axios from "axios";

export interface BacklinkCounts {
    backlinks: {
        total: number;
        doFollow: number;
        fromHomePage: number;
        doFollowFromHomePage: number;
        text: number;
        toHomePage: number;
    };
    domains: {
        total: number;
        doFollow: number;
        fromHomePage: number;
        toHomePage: number;
    };
    ips: number | null;
    cBlocks: number | null;
    anchors: number | null;
    anchorUrls: number | null;
    topTLD: string | null;
    topCountry: string | null;
    topAnchorsByBacklinks: any[] | null;
    topAnchorsByDomains: any[] | null;
    topAnchorUrlsByBacklinks: any[] | null;
    topAnchorUrlsByDomains: any[] | null;
}

export interface BacklinkItem {
    url_from: string;
    url_to: string;
    title: string;
    anchor: string;
    alt: string;
    nofollow: boolean;
    image: boolean;
    image_source: string;
    inlink_rank: number;
    domain_inlink_rank: number;
    first_seen: string; // ISO Date string
    last_visited: string; // ISO Date string
}

export interface BacklinkApiResponse {
    counts: BacklinkCounts;
    backlinks: BacklinkItem[];
}


export const getAllBacklinks = async (
    website: string,
    apiKey: string
): Promise<BacklinkApiResponse> => {
    try {
        const response = await axios.get<BacklinkApiResponse>(
            "https://vebapi.com/api/seo/backlinkdata",
            {
                params: { website },
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error("Error fetching backlinks:", error.response?.data || error.message);
        throw error;
    }
};
