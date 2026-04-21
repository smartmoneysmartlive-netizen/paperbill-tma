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

  private static NETWORK_NAME_MAP: Record<number, string> = {
    1: 'mtn',
    2: 'glo',
    3: 'airtel',
    4: '9mobile'
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
    } catch (err) {
      console.warn('[Orchestrator] VTUGate Airtime failed, falling back...');
    }

    // 2. Fallback to CheapDataHub
    try {
      const resp = await fetch(`${this.CHEAPDATAHUB_URL}/airtime/purchase/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHEAPDATAHUB_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider_id: providerId, phone_number: phone, amount }),
      });
      const data = await resp.json();
      
      const success = data.status === "true";
      return {
        success,
        message: data.message,
        reference: data.transaction_id || data.reference,
        provider: success ? 'cheapdatahub' : 'failed'
      };
    } catch (err) {
      return { success: false, message: 'All providers failed', provider: 'failed' };
    }
  }

  /**
   * Orchestrated Data Purchase
   */
  static async buyData(networkId: number, phone: string, planId: number, amount: number): Promise<VTUResponse> {
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
    } catch (err) {
      console.warn('[Orchestrator] VTUGate Data failed, falling back...');
    }

    // 2. Fallback to CheapDataHub
    try {
      const resp = await fetch(`${this.CHEAPDATAHUB_URL}/data/purchase/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHEAPDATAHUB_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider_id: networkId, phone_number: phone, plan_id: planId }),
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
