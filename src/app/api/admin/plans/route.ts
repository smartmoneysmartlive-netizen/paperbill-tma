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
    const plans = await VTUGateService.getPlans(serviceId);
    return NextResponse.json(plans);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
