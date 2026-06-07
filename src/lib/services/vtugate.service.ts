import { AuditLogger } from './logger.service';

export type VTUGateResponse = {
  status: any; // Can be number (1/0), boolean (true/false), or string ('success')
  message: string;
  data?: any;
};

export class VTUGateService {
  private static BASE_URL = 'https://api.vtugate.com/api/v1';
  private static API_KEY = process.env.VTUGATE_API_KEY || '95df79959cf58862066205bf73f5e96f';

  // Fallback IDs — only used when API discovery fails. These can go stale
  // when VTUGate changes providers, so discovery is always tried first.
  private static FALLBACK_SERVICE_ID_MAP: Record<string, string> = {
    'airtime_mtn': '58',
    'airtime_glo': '5',
    'airtime_airtel': '4',
    'airtime_9mobile': '6',
    'data_mtn': '62',
    'data_glo': '110',
    'data_airtel': '63',
    'data_9mobile': '48',
    'tv_dstv': '7',
    'tv_gotv': '8',
    'tv_startimes': '17',
    'electricity_abuja': '1',
    'electricity_eko': '2',
    'electricity_ikeja': '4'
  };

  // Runtime cache for discovered service IDs (persists within serverless function lifecycle)
  private static discoveredServiceIds: Record<string, string> = {};

  /**
   * Normalizes a Nigerian phone number to the 11-digit local format (0XXXXXXXXXX).
   * Handles: "7061785512" → "07061785512", "2347061785512" → "07061785512",
   *          "+2347061785512" → "07061785512", "07061785512" → "07061785512"
   */
  private static normalizePhone(phone: string): string {
    let cleaned = phone.replace(/[\s\-\+]/g, '');
    if (cleaned.startsWith('234') && cleaned.length === 13) {
      cleaned = '0' + cleaned.slice(3);
    }
    if (cleaned.length === 10 && !cleaned.startsWith('0')) {
      cleaned = '0' + cleaned;
    }
    return cleaned;
  }

  /**
   * Checks if a VTUGate response indicates success.
   * VTUGate returns status in various formats: number (1), boolean (true), or string ('success').
   * This is the SINGLE SOURCE OF TRUTH for interpreting VTUGate responses.
   */
  static isSuccess(response: VTUGateResponse): boolean {
    return (
      String(response.status) === '1' ||
      response.status === true ||
      String(response.status).toLowerCase() === 'success'
    );
  }

  /**
   * Universal fetch for VTUGate
   */
  private static async request(endpoint: string, params: Record<string, any>, method: 'POST' | 'GET' = 'POST'): Promise<VTUGateResponse> {
    try {
      let url = `${this.BASE_URL}${endpoint}`;
      const options: any = {
        method,
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`
        }
      };

      if (method === 'POST') {
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        options.body = new URLSearchParams(params);
      } else {
        const query = new URLSearchParams(params).toString();
        if (query) url += `?${query}`;
      }

      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!this.isSuccess(data)) {
        console.warn(`[VTUGate] API Warning (${endpoint}):`, data.message || 'No message', JSON.stringify(data));
      }
      
      return data;
    } catch (err: any) {
      console.error(`[VTUGate] Request Error (${endpoint}):`, err.message || err);
      return { status: 0, message: 'VTUGate connection failed' };
    }
  }

  /**
   * Fetches the correct service ID for a given type/network from the VTUGate API.
   * Strategy: Cached discovery > Live API discovery > Hardcoded fallback.
   * This prevents stale hardcoded IDs from causing "Invalid service_id" errors.
   */
  private static async getServiceId(type: string, networkName: string): Promise<string | null> {
    const key = `${type}_${networkName.toLowerCase()}`;

    // 1. Check runtime cache first (fastest, already verified to work)
    if (this.discoveredServiceIds[key]) {
      return this.discoveredServiceIds[key];
    }

    // 2. Try live API discovery (most reliable)
    try {
      const resp = await this.request('/fetchservices', { service_type: type });
      
      if (this.isSuccess(resp) && Array.isArray(resp.data)) {
        // Log available services for debugging
        console.log(`[VTUGate] Available ${type} services:`, resp.data.map((s: any) => `${s.network_name}(${s.service_id})`).join(', '));

        const service = resp.data.find((s: any) =>
          s.network_name?.toLowerCase().includes(networkName.toLowerCase())
        );

        if (service) {
          const serviceId = String(service.service_id);
          // Cache for subsequent calls
          this.discoveredServiceIds[key] = serviceId;
          console.log(`[VTUGate] Discovered ${key} = ${serviceId}`);
          return serviceId;
        }

        console.warn(`[VTUGate] No service matching "${networkName}" for type "${type}". Available:`, resp.data.map((s: any) => s.network_name).join(', '));
      }
    } catch (err) {
      console.warn(`[VTUGate] Service discovery failed for ${key}:`, err);
    }

    // 3. Last resort: hardcoded fallback (may be stale)
    if (this.FALLBACK_SERVICE_ID_MAP[key]) {
      console.warn(`[VTUGate] Using hardcoded fallback ID for ${key}: ${this.FALLBACK_SERVICE_ID_MAP[key]}`);
      return this.FALLBACK_SERVICE_ID_MAP[key];
    }

    console.error(`[VTUGate] No service ID found for ${key} — discovery and fallback both failed.`);
    return null;
  }

  /**
   * Buy Airtime
   */
  static async buyAirtime(network: string, phone: string, amount: number) {
    const serviceId = await this.getServiceId('airtime', network);
    if (!serviceId) throw new Error(`VTUGate: Service ID not found for ${network}`);

    return await this.request('/buyairtime', {
      service_id: serviceId,
      phone_number: this.normalizePhone(phone),
      amount: amount
    });
  }

  /**
   * Buy Data
   * planCode in VTUGate is often different from CheapDataHub, so we need care.
   */
  static async buyData(network: string, phone: string, amount: number, planCode: string) {
    const serviceId = await this.getServiceId('data', network);
    if (!serviceId) throw new Error(`VTUGate: Service ID not found for ${network} Data`);

    // If using ID 110 (Glo CG) or similar, the code might need to be numeric.
    // We'll try to find the code in the plans for this service if it looks wrong.
    let finalCode: string | number = planCode;
    
    return await this.request('/buydata', {
      service_id: serviceId,
      phone_number: this.normalizePhone(phone),
      amount: amount,
      plan_code: finalCode
    });
  }

  /**
   * Buy Cable TV
   */
  static async buyCableTV(provider: string, phone: string, smartcard: string, amount: number, planCode: string, planName: string) {
     const serviceId = await this.getServiceId('tv', provider);
     if (!serviceId) throw new Error(`VTUGate: Service ID not found for ${provider}`);

     return await this.request('/buycabletv', {
        service_id: serviceId,
        phone,
        smartcard_number: smartcard,
        amount,
        plan_code: planCode,
        plan_name: planName
     });
  }

  /**
   * Buy Electricity
   */
  static async buyElectricity(disco: string, meter: string, phone: string, amount: number) {
     const serviceId = await this.getServiceId('electricity', disco);
     if (!serviceId) throw new Error(`VTUGate: Service ID not found for ${disco}`);

     return await this.request('/buyelectricity', {
        service_id: serviceId,
        meter_no: meter,
        disco: disco.toLowerCase(),
        amount,
        phone_number: this.normalizePhone(phone)
     });
  }

  /**
   * Fetch variations/plans for a service
   */
  static async getPlans(serviceId: string) {
    return await this.request('/fetchdataplans', { service_id: serviceId });
  }
}
