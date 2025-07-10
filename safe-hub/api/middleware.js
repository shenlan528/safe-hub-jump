import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export async function middleware(req) {
  const ua = req.headers.get('user-agent')?.toLowerCase() || '';
  const referer = req.headers.get('referer') || '';
  const url = req.nextUrl;
  const pathname = url.pathname;

  const blacklist = JSON.parse(await fs.readFile('ua-blacklist.json', 'utf-8'));
  const whitelist = JSON.parse(await fs.readFile('browser-whitelist.json', 'utf-8'));

  const isBlacklisted = blacklist.some(keyword => ua.includes(keyword));
  const isNotWhitelisted = !whitelist.some(keyword => ua.includes(keyword));
  const isFromTiktok = referer.includes('tiktok');

  // 拦截二维码图片请求（仅允许系统浏览器访问）
  if (pathname.startsWith('/qr-') && pathname.endsWith('.png')) {
    if (isBlacklisted || isNotWhitelisted || isFromTiktok) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  return NextResponse.next();
}
