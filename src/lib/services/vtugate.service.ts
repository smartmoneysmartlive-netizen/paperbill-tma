import { AuditLogger } from './logger.service';

export type VTUGateResponse = {
  status: number;
  message: string;
  data?: any;
};

export class VTUGateService {
  private static BASE_URL = 'https://api.vtugate.com/api/v1';
  private static API_KEY = process.env.VTUGATE_API_KEY || '95df79959cf58862066205bf73f5e96f';

  /**
   * Universal fetch for VTUGate
   */
  public static async request(endpoint: string, params: Record<string, any>, method: 'POST' | 'GET' = 'POST'): Promise<VTUGateResponse> {
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
      console.log(`[VTUGate-DEBUG] ${method} Response (${endpoint}):`, JSON.stringify(data));
      return data;
    } catch (err) {
      console.error(`[VTUGate] Request Error (${endpoint}):`, err);
      return { status: 0, message: 'VTUGate connection failed' };
    }
  }

  /**
   * Dynamically discovery service IDs from the dashboard
   */
  private static async getServiceId(type: string, networkName: string): Promise<string | null> {
    const resp = await this.request('/fetchservices', { service_type: type });
    if (resp.status === 1 && Array.isArray(resp.data)) {
      const service = resp.data.find((s: any) => 
        s.network_name.toLowerCase().includes(networkName.toLowerCase())
      );
      return service ? String(service.service_id) : null;
    }
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
      phone_number: phone,
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

    return await this.request('/buydata', {
      service_id: serviceId,
      phone_number: phone,
      amount: amount,
      plan_code: planCode
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
        phone_number: phone
     });
  }

  /**
   * Fetch variations/plans for a service
   */
  static async getPlans(serviceId: string) {
    return await this.request('/fetchplans', { service_id: serviceId });
  }
}
