// Post-deploy check: proves the LIVE site serves the built app, not raw source.
// Usage: node scripts/verify-live.mjs <url>   (zero dependencies, Node 18+)
const base = process.argv[2];
if (!base) {
  console.error('usage: node scripts/verify-live.mjs <url>');
  process.exit(2);
}
const root = base.endsWith('/') ? base : `${base}/`;
const attempts = Number(process.env.VERIFY_ATTEMPTS ?? 12);
const delayMs = Number(process.env.VERIFY_DELAY_MS ?? 10_000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function check() {
  const problems = [];
  const page = await fetch(root, { redirect: 'follow' });
  if (page.status !== 200) return [`GET ${root} returned ${page.status}`];
  const html = await page.text();

  // Branch-based Pages deploys publish repo source; source index.html points at /src/main.tsx.
  if (html.includes('/src/main.tsx')) problems.push('HTML references /src/main.tsx: raw source is live, not the build');
  if (!html.includes('id="root"')) problems.push('HTML has no #root mount point');

  const refs = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|svg|ico))"/g)].map((m) => m[1]);
  const assets = refs.filter((r) => !r.startsWith('http'));
  if (!assets.some((r) => r.endsWith('.js'))) problems.push('no script bundle referenced');
  if (!assets.some((r) => r.endsWith('.css'))) problems.push('no stylesheet referenced');

  for (const ref of assets) {
    const url = new URL(ref, root).toString();
    const res = await fetch(url);
    const type = res.headers.get('content-type') ?? '';
    const size = (await res.arrayBuffer()).byteLength;
    if (res.status !== 200) problems.push(`${url} returned ${res.status}`);
    else if (ref.endsWith('.js') && !/javascript/.test(type)) problems.push(`${url} content-type is ${type}`);
    else if (ref.endsWith('.css') && !/css/.test(type)) problems.push(`${url} content-type is ${type}`);
    else if ((ref.endsWith('.js') || ref.endsWith('.css')) && size < 1000) problems.push(`${url} is only ${size} bytes`);
    else console.log(`ok  ${res.status} ${type.split(';')[0].padEnd(24)} ${size}B  ${url}`);
  }
  return problems;
}

for (let i = 1; i <= attempts; i++) {
  try {
    const problems = await check();
    if (problems.length === 0) {
      console.log(`live site verified: ${root}`);
      process.exit(0);
    }
    console.log(`attempt ${i}/${attempts}: ${problems.join('; ')}`);
  } catch (err) {
    console.log(`attempt ${i}/${attempts}: ${err.message}`);
  }
  if (i < attempts) await sleep(delayMs);
}
console.error(`FAILED: ${root} did not serve a healthy build`);
process.exit(1);
