type VTUResponse = {
  success: boolean;
  message: string;
  reference?: string;
  data?: any;
};

export class VTUService {
  private static CHEAPDATAHUB_URL = 'https://www.cheapdatahub.ng/api/v1/resellers';
  private static VTU_NG_URL = 'https://vtu.ng/wp-json/api/v1';

  /**
   * Primary Provider: CheapDataHub
   */
  static async buyAirtime(providerId: number, phone: string, amount: number): Promise<VTUResponse> {
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
      return {
        success: data.status === "true",
        message: data.message,
        reference: data.transaction_id || data.reference
      };
    } catch (err) {
      console.error('CheapDataHub Fail:', err);
      // Fallback to VTU.ng
      return this.vtuNgAirtime(phone, amount);
    }
  }

  /**
   * Backup Provider: VTU.ng
   */
  private static async vtuNgAirtime(phone: string, amount: number): Promise<VTUResponse> {
    try {
      const username = process.env.VTU_NG_USER;
      const password = process.env.VTU_NG_PASS;
      const url = `${this.VTU_NG_URL}/airtime?username=${username}&password=${password}&phone=${phone}&network_id=mtn&amount=${amount}`;
      
      const resp = await fetch(url);
      const data = await resp.json();
      return {
        success: data.code === "success",
        message: data.message,
        reference: data.data?.order_id
      };
    } catch (err) {
      return { success: false, message: 'All providers failed' };
    }
  }

  static async buyData(bundleId: string, phone: string): Promise<VTUResponse> {
     // Implementation similar to Airtime
     return { success: true, message: 'Mock Data Success' };
  }

  static async buyElectricity(disco: string, meter: string, type: 'prepaid'|'postpaid', amount: number): Promise<VTUResponse> {
     // VTU.ng logic for electricity
     return { success: true, message: 'Mock Electricity Success' };
  }
}
