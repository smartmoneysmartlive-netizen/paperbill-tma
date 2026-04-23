import { VTUGateService } from './vtugate.service';

export type VTUResponse = {
  success: boolean;
  message: string;
  reference?: string;
  provider: string; // Tracks which provider fulfilled the request
  data?: any;
};

export class VTUService {
  private static CHEAPDATAHUB_URL = 'https://www.cheapdatahub.ng/api/v1/resellers';

  private static NETWORK_NAME_MAP: Record<string | number, string> = {
    1: 'mtn', 'mtn': 'mtn',
    2: 'glo', 'glo': 'glo',
    3: 'airtel', 'airtel': 'airtel',
    4: '9mobile', '9mobile': '9mobile'
  };

  private static CHEAPDATAHUB_ID_MAP: Record<string | number, number> = {
    'mtn': 1, 1: 1,
    'glo': 2, 2: 2,
    'airtel': 3, 3: 3,
    '9mobile': 4, 4: 4
  };

  // Mapping our string codes to CheapDataHub's numeric IDs
  private static CHEAPDATAHUB_PLAN_MAP: Record<string, string> = {
    'MT003': '7',   // MTN 1GB
    'MT004': '8',   // MTN 2GB
    'MT008': '11',  // MTN 5GB
    'GD3': '13',    // Glo 1GB (approx)
    'ANR3': '19',   // Airtel 1GB
    'EQ1': '25'     // 9mobile 1GB
  };

  /**
   * Orchestrated Airtime Purchase
   * VTUGate (Primary) -> CheapDataHub (Fallback)
   */
  static async buyAirtime(providerId: number, phone: string, amount: number): Promise<VTUResponse> {
    const networkName = this.NETWORK_NAME_MAP[providerId] || 'mtn';

    // 1. Try VTUGate
    try {
      const gateResp = await VTUGateService.buyAirtime(networkName, phone, amount);
      if (gateResp.status === 1) {
        return {
          success: true,
          message: gateResp.message,
          reference: gateResp.data?.reference || `VTG_${Date.now()}`,
          provider: 'vtugate'
        };
      }
    } catch (err: any) {
      console.warn(`[Orchestrator] VTUGate Airtime failed for ${networkName}:`, err.message || err);
    }

    const cheapDataHubId = this.CHEAPDATAHUB_ID_MAP[providerId] || 1;

    // 2. Fallback to CheapDataHub
    try {
      const resp = await fetch(`${this.CHEAPDATAHUB_URL}/airtime/purchase/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHEAPDATAHUB_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider_id: cheapDataHubId, phone_number: phone, amount }),
      });
      const data = await resp.json();
      
      const success = data.status === "true";
      return {
        success,
        message: data.message,
        reference: data.transaction_id || data.reference,
        provider: success ? 'cheapdatahub' : 'failed'
      };
    } catch (err: any) {
      console.error(`[Orchestrator] CheapDataHub Airtime Error:`, err.message || err);
      return { success: false, message: 'All providers failed', provider: 'failed' };
    }
  }

  /**
   * Orchestrated Data Purchase
   */
  static async buyData(networkId: number, phone: string, planId: string | number, amount: number): Promise<VTUResponse> {
    const networkName = this.NETWORK_NAME_MAP[networkId] || 'mtn';

    // 1. Try VTUGate (primary)
    // We pass amount and we might need planCode mapping but for now use planId as code
    try {
      const gateResp = await VTUGateService.buyData(networkName, phone, amount, String(planId));
      if (gateResp.status === 1) {
        return {
          success: true,
          message: gateResp.message,
          reference: gateResp.data?.reference || `VTG_${Date.now()}`,
          provider: 'vtugate'
        };
      }
    } catch (err: any) {
      console.warn(`[Orchestrator] VTUGate Data failed for ${networkName}:`, err.message || err);
    }

    const cheapDataHubId = this.CHEAPDATAHUB_ID_MAP[networkId] || 1;

    // 2. Fallback to CheapDataHub
    try {
      const cheapDataHubPlanId = this.CHEAPDATAHUB_PLAN_MAP[String(planId)] || planId;
      
      const resp = await fetch(`${this.CHEAPDATAHUB_URL}/data/purchase/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHEAPDATAHUB_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          provider_id: cheapDataHubId, 
          phone_number: phone, 
          plan_id: cheapDataHubPlanId 
        }),
      });
      const data = await resp.json();
      const success = data.status === "true";
      
      if (!success) {
        console.warn(`[Orchestrator] CheapDataHub Data failed: ${data.message || 'Unknown error'}`);
      }

      return {
        success,
        message: data.message,
        reference: data.transaction_id || data.reference,
        provider: success ? 'cheapdatahub' : 'failed'
      };
    } catch (err: any) {
      console.error(`[Orchestrator] CheapDataHub Error:`, err.message);
      return { success: false, message: 'Data provider failed', provider: 'failed' };
    }
  }

  /**
   * Orchestrated Electricity
   */
  static async buyElectricity(disco: string, meter: string, phone: string, amount: number): Promise<VTUResponse> {
    // 1. Try VTUGate
    try {
      const gateResp = await VTUGateService.buyElectricity(disco, meter, phone, amount);
      if (gateResp.status === 1) {
        return {
          success: true,
          message: gateResp.message,
          reference: gateResp.data?.token || gateResp.data?.reference,
          provider: 'vtugate'
        };
      }
    } catch (err) {
      console.warn('[Orchestrator] VTUGate Electricity failed');
    }

    return { success: false, message: 'Electricity provider unavailable', provider: 'failed' };
  }

  /**
   * Orchestrated Cable TV
   */
  static async buyCableTV(provider: string, phone: string, smartcard: string, amount: number, planCode: string, planName: string): Promise<VTUResponse> {
    // 1. Try VTUGate
    try {
      const gateResp = await VTUGateService.buyCableTV(provider, phone, smartcard, amount, planCode, planName);
      if (gateResp.status === 1) {
        return {
          success: true,
          message: gateResp.message,
          reference: gateResp.data?.reference || `VTG_${Date.now()}`,
          provider: 'vtugate'
        };
      }
    } catch (err) {
      console.warn('[Orchestrator] VTUGate Cable failed');
    }

    return { success: false, message: 'Cable TV provider unavailable', provider: 'failed' };
  }
}
