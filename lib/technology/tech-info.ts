/**
 * Fetches Server IP Address(es) for a domain using Cloudflare DNS over HTTPS API
 * @param domain - The domain to query
 * @returns Object containing IP addresses and status
 */
export async function getServerIP(domain: string): Promise<{
    ipAddresses: string[];
    status: 'good' | 'warning' | 'error';
    message: string;
}> {
    const url = `https://1.1.1.1/dns-query?name=${domain}&type=A`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/dns-json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.Answer) {
                const ipAddresses = data.Answer.map((record: { data: string }) => record.data);
                return {
                    ipAddresses,
                    status: 'good',
                    message: `Found ${ipAddresses.length} IP address(es) for ${domain}`
                };
            } else {
                return {
                    ipAddresses: [],
                    status: 'error',
                    message: `No IP addresses found for ${domain}`
                };
            }
        } else {
            return {
                ipAddresses: [],
                status: 'error',
                message: `Error fetching IP: ${response.statusText}`
            };
        }
    } catch (error) {
        return {
            ipAddresses: [],
            status: 'error',
            message: `Error fetching IP: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * Fetches DNS Servers for a domain using Cloudflare DNS over HTTPS API
 * @param domain - The domain to query
 * @returns Object containing DNS servers and status
 */
export async function getDNSServers(domain: string): Promise<{
    dnsServers: string[];
    status: 'good' | 'warning' | 'error';
    message: string;
}> {
    const url = `https://1.1.1.1/dns-query?name=${domain}&type=NS`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/dns-json'
            }
        });

        if (response.ok) {
            const data = await response.json();

            if (data.Answer) {
                const dnsServers = data.Answer.map((record: { data: string }) => record.data);
                return {
                    dnsServers,
                    status: 'good',
                    message: `Found ${dnsServers.length} DNS server(s) for ${domain}`
                };
            } else {
                return {
                    dnsServers: [],
                    status: 'error',
                    message: `No DNS servers found for ${domain}`
                };
            }
        } else {
            return {
                dnsServers: [],
                status: 'error',
                message: `Error fetching DNS: ${response.statusText}`
            };
        }
    } catch (error) {
        return {
            dnsServers: [],
            status: 'error',
            message: `Error fetching DNS: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

/**
 * Combined function to get both Server IP and DNS Servers
 * @param domain - The domain to query
 * @returns Object containing both IP and DNS information
 */
export async function getTechnologyInfo(domain: string): Promise<{
    serverIP: {
        ipAddresses: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
    dnsServers: {
        dnsServers: string[];
        status: 'good' | 'warning' | 'error';
        message: string;
    };
}> {
    const [serverIP, dnsServers] = await Promise.all([
        getServerIP(domain),
        getDNSServers(domain)
    ]);

    return {
        serverIP,
        dnsServers
    };
}
