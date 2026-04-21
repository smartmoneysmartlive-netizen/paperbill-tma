import { NextRequest, NextResponse } from 'next/server';
import { VTUGateService } from '@/lib/services/vtugate.service';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const serviceId = searchParams.get('id');

  if (!serviceId) {
    return NextResponse.json({ error: 'Provide a serviceId, e.g., ?id=41' }, { status: 400 });
  }

  try {
    const endpoints = ['/fetchplans', '/fetchservicedetails', '/fetchvariations', '/fetchserviceproducts'];
    const results: any = {};

    for (const ep of endpoints) {
      try {
        const data = await VTUGateService.request(ep, { service_id: serviceId });
        results[ep] = data;
        // Using loose equality to handle both boolean (true) and number (1) from API
        if (data.status == true || data.status == 1) {
          return NextResponse.json({ working_endpoint: ep, data });
        }
      } catch (e) {
        results[ep] = { error: 'failed' };
      }
    }

    return NextResponse.json({ 
      description: 'Scanner finished. No working endpoint found yet.',
      results 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
