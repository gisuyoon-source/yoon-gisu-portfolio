const sharp = require('sharp');
const path  = require('path');

const W = 1200, H = 630;
const imgDir = path.join(__dirname, 'images');

async function main() {
  // 우측 프로필 사진: 세로 전체(630) 유지, 가로는 비율 맞춰 crop
  const PROFILE_W = 500;
  const profileBuf = await sharp(path.join(imgDir, 'profile.png'))
    .resize(PROFILE_W, H, { fit: 'cover', position: 'top' })
    .toBuffer();

  // 프로필 좌측 블랙 페이드 그라데이션
  const fadeBuf = Buffer.from(`
    <svg width="${PROFILE_W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stop-color="#000" stop-opacity="1"/>
          <stop offset="55%"  stop-color="#000" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="${PROFILE_W}" height="${H}" fill="url(#g)"/>
    </svg>`);

  // 텍스트 SVG (YOON / GISU / 서브타이틀)
  const textBuf = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="80" y="255"
        font-family="Arial Black, Impact, sans-serif"
        font-size="190" font-weight="900"
        fill="#FFFFFF" letter-spacing="-6">YOON</text>
      <text x="80" y="455"
        font-family="Arial Black, Impact, sans-serif"
        font-size="190" font-weight="900"
        fill="#FF6B35" letter-spacing="-6">GISU</text>
      <text x="84" y="598"
        font-family="Arial, sans-serif"
        font-size="20" font-weight="400"
        fill="rgba(255,255,255,0.65)" letter-spacing="2">BX CX | SKT T Factory</text>
    </svg>`);

  await sharp({
    create: { width: W, height: H, channels: 4, background: { r:0, g:0, b:0, alpha:1 } }
  })
  .composite([
    { input: profileBuf, left: W - PROFILE_W, top: 0 },
    { input: fadeBuf,    left: W - PROFILE_W, top: 0 },
    { input: textBuf,    left: 0,             top: 0 },
  ])
  .png()
  .toFile(path.join(imgDir, 'og.png'));

  console.log('og.png 생성 완료');
}

main().catch(e => { console.error(e); process.exit(1); });
