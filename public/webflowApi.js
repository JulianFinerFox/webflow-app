var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// WebflowApiClient class
export class WebflowApiClient {
    constructor(apiToken, siteId) {
        this.baseUrl = 'https://api.webflow.com/v2';
        this.apiToken = apiToken;
        this.siteId = siteId;
    }
    get headers() {
        return {
            'Authorization': `Bearer ${this.apiToken}`,
            'accept': 'application/json',
            'content-type': 'application/json'
        };
    }
    listAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/sites/${this.siteId}/assets`, { headers: this.headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                return data.assets.map((asset) => ({
                    _id: asset._id,
                    name: asset.name,
                    type: asset.type,
                    url: asset.url,
                    createdOn: asset.createdOn || asset._createdOn || new Date().toISOString(),
                    updatedOn: asset.updatedOn || asset._updatedOn
                }));
            }
            catch (error) {
                console.error('Error fetching assets:', error);
                throw error;
            }
        });
    }
    getAsset(assetId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/sites/${this.siteId}/assets/${assetId}`, { headers: this.headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const asset = yield response.json();
                return {
                    _id: asset._id,
                    name: asset.name,
                    type: asset.type,
                    url: asset.url,
                    createdOn: asset.createdOn || asset._createdOn || new Date().toISOString(),
                    updatedOn: asset.updatedOn || asset._updatedOn
                };
            }
            catch (error) {
                console.error('Error fetching asset:', error);
                throw error;
            }
        });
    }
}
