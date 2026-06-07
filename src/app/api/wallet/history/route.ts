import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) throw new Error('Unauthorized');

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Format for frontend
    const formatted = transactions.map(tx => ({
      id: tx.id,
      type: tx.type.charAt(0) + tx.type.slice(1).toLowerCase().replace('_', ' '),
      amountFormatted: (tx.amount / 100).toLocaleString('en-NG', { style: 'currency', currency: 'NGN' }),
      amountRaw: tx.amount / 100,
      isCredit: tx.type === 'CREDIT',
      date: new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: tx.status.charAt(0) + tx.status.slice(1).toLowerCase(),
      logo: getServiceLogo(tx.type, tx.metadata)
    }));

    return NextResponse.json({
      success: true,
      transactions: formatted
    });

  } catch (err: any) {
    console.error('[History API Error]:', err.message);
    return NextResponse.json({ 
      success: false, 
      message: err.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}

function getServiceLogo(type: string, metadataJson: any) {
  let metadata: any = {};
  try {
    if (metadataJson) {
      metadata = typeof metadataJson === 'string' ? JSON.parse(metadataJson) : metadataJson;
    }
  } catch (e) {
    console.error('Error parsing transaction metadata:', e);
  }

  const providerId = (metadata?.networkId || metadata?.provider || '').toLowerCase();

  if (type === 'DATA' || type === 'AIRTIME') {
    if (providerId.includes('mtn')) return '/brand-logos/mtn.jpg';
    if (providerId.includes('airtel')) return '/brand-logos/airtel.png';
    if (providerId.includes('glo')) return '/brand-logos/glo.png';
    if (providerId.includes('9mobile')) return '/brand-logos/9mobile.jpg';
    return '/brand-logos/mtn.jpg';
  }

  if (type === 'CABLE_TV') {
    if (providerId.includes('dstv')) return '/brand-logos/dstv.png';
    if (providerId.includes('gotv')) return '/brand-logos/gotv.png';
    if (providerId.includes('startimes')) return '/brand-logos/startimes.png';
    return '';
  }

  if (type === 'ELECTRICITY') {
    const disco = (metadata?.disco || providerId || '').toLowerCase();
    if (disco.includes('abuja') || disco.includes('aedc')) return '/brand-logos/Abuja.png';
    if (disco.includes('eko') || disco.includes('ekedc')) return '/brand-logos/Eko.png';
    if (disco.includes('ibadan') || disco.includes('ibedc')) return '/brand-logos/Ibadan.png';
    if (disco.includes('ikeja') || disco.includes('ikedc')) return '/brand-logos/Ikeja.png';
    if (disco.includes('kaduna')) return '/brand-logos/Kaduna.png';
    if (disco.includes('port harcourt') || disco.includes('phedc')) return '/brand-logos/Port.png';
    if (disco.includes('jos') || disco.includes('jed')) return '/brand-logos/Jos.png';
    if (disco.includes('enugu') || disco.includes('eedc')) return '/brand-logos/Enugu.png';
    if (disco.includes('yola') || disco.includes('yedc')) return '/brand-logos/Yola.png';
    if (disco.includes('benin') || disco.includes('bedc')) return '/brand-logos/Benin.png';
    return '/brand-logos/Ikeja.png';
  }

  if (type === 'EDUCATION') {
    if (providerId.includes('waec')) return '/brand-logos/waec.jpg';
    if (providerId.includes('neco')) return '/brand-logos/neco.jpg';
    if (providerId.includes('nabteb')) return '/brand-logos/nabteb.jpeg';
    return '';
  }

  return '';
}
