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
    const endpoints = [
      '/fetchplans', '/fetchservicedetails', '/fetchvariations', 
      '/fetchserviceproducts', '/getvariations', '/fetchallplans',
      '/service_plans', '/fetch_variations', '/getplans', 
      '/variations', '/plans', '/servicedetails', '/variation',
      '/fetch_plans', '/fetch_service_plans'
    ];
    const results: any = {};

    for (const method of ['POST', 'GET'] as const) {
      for (const ep of endpoints) {
        try {
          const data = await VTUGateService.request(ep, { service_id: serviceId }, method);
          
          const status = data.status as any;
          if (status == true || status == 1) {
            return NextResponse.json({ working_method: method, working_endpoint: ep, data });
          }
          
          results[`${method} ${ep}`] = data.message || 'Failed';
        } catch (e: any) {
          results[`${method} ${ep}`] = { error: e.message };
        }
      }
    }

    return NextResponse.json({ 
      description: 'Super Scanner finished. No working endpoint found.',
      attempts: results 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
