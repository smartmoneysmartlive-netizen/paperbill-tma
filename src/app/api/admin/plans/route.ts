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
      '/fetchplans', '/fetchvariations', '/getplans', 
      '/getvariations', '/variations', '/plans', 
      '/fetchservicedetails', '/servicedetails'
    ];
    const paramKeys = ['service_id', 'serviceid', 'id', 'service_code'];
    const results: any = {};

    for (const method of ['POST', 'GET'] as const) {
      for (const ep of endpoints) {
        for (const pk of paramKeys) {
          try {
            const data = await VTUGateService.request(ep, { [pk]: serviceId }, method);
            
            const status = data.status as any;
            if (status == true || status == 1) {
              return NextResponse.json({ 
                working_method: method, 
                working_endpoint: ep, 
                working_param: pk,
                data 
              });
            }
            results[`${method} ${ep} (${pk})`] = data.message || 'Failed';
          } catch (e: any) {
            results[`${method} ${ep} (${pk})`] = { error: e.message };
          }
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
