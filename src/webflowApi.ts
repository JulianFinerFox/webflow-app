// WebflowAsset interface
export interface WebflowAsset {
    _id: string;
    name: string;
    type: string;
    url: string;
    createdOn: string;
    updatedOn?: string;
}

// WebflowApiClient class
export class WebflowApiClient {
    private readonly apiToken: string;
    private readonly siteId: string;
    private readonly baseUrl = 'https://api.webflow.com/v2';

    constructor(apiToken: string, siteId: string) {
        this.apiToken = apiToken;
        this.siteId = siteId;
    }

    private get headers() {
        return {
            'Authorization': `Bearer ${this.apiToken}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        };
    }

    async listAssets(): Promise<WebflowAsset[]> {
        try {
            const response = await fetch(
                `${this.baseUrl}/sites/${this.siteId}/assets`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.assets.map((asset: any) => ({
                _id: asset._id,
                name: asset.name,
                type: asset.type,
                url: asset.url,
                createdOn: asset.createdOn || asset._createdOn || new Date().toISOString(),
                updatedOn: asset.updatedOn || asset._updatedOn
            }));
        } catch (error) {
            console.error('Error fetching assets:', error);
            throw error;
        }
    }

    async getAsset(assetId: string): Promise<WebflowAsset> {
        try {
            const response = await fetch(
                `${this.baseUrl}/sites/${this.siteId}/assets/${assetId}`,
                { headers: this.headers }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const asset = await response.json();
            return {
                _id: asset._id,
                name: asset.name,
                type: asset.type,
                url: asset.url,
                createdOn: asset.createdOn || asset._createdOn || new Date().toISOString(),
                updatedOn: asset.updatedOn || asset._updatedOn
            };
        } catch (error) {
            console.error('Error fetching asset:', error);
            throw error;
        }
    }
} 