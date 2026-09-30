const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourceImage = path.resolve(__dirname, '../src/assets/images/vittaconect_app_icon_1790788178939.jpg');
const publicDir = path.resolve(__dirname, '../public');

if (fs.existsSync(sourceImage)) {
  console.log('Generating PNG icons from the original user image:', sourceImage);
  execSync(`convert "${sourceImage}" -resize 512x512 "${path.join(publicDir, 'pwa-512x512.png')}"`);
  execSync(`convert "${sourceImage}" -resize 512x512 "${path.join(publicDir, 'pwa-maskable-512x512.png')}"`);
  execSync(`convert "${sourceImage}" -resize 192x192 "${path.join(publicDir, 'pwa-192x192.png')}"`);
  execSync(`convert "${sourceImage}" -resize 180x180 "${path.join(publicDir, 'apple-touch-icon.png')}"`);
  execSync(`convert "${sourceImage}" -resize 64x64 "${path.join(publicDir, 'favicon.png')}"`);
  fs.copyFileSync(sourceImage, path.join(publicDir, 'vittaconect-logo.jpg'));
  console.log('Successfully generated all icons from original user image.');
} else {
  console.warn('Source image not found at', sourceImage);
}
