export const config = {
  matcher: ['/api/copy']
};

let uaBlacklist = [];
let browserWhitelist = [];

(async () => {
  uaBlacklist = (await import('./ua-blacklist.json')).default;
  browserWhitelist = (await import('./browser-whitelist.json')).default;
})();

export default function middleware(req) {
  const ua = req.headers.get('user-agent') || '';
  const referer = req.headers.get('referer') || '';

  const isIframe = referer && !referer.startsWith(req.nextUrl.origin);
  const uaLower = ua.toLowerCase();
  const isBlacklisted = uaBlacklist.some(keyword => uaLower.includes(keyword));
  const isWhitelisted = browserWhitelist.some(browser => uaLower.includes(browser));

  if (isIframe || isBlacklisted || !isWhitelisted) {
    return new Response('Access denied', { status: 403 });
  }
}
