const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');

const EXTENSION_PATH = path.resolve(__dirname, '../extension');
const USER_DATA_DIR = path.join(os.homedir(), '.anti-fingerprint', 'browser-profile');

async function launchBrowser(options = {}) {
  await fs.ensureDir(USER_DATA_DIR);

  const args = [
    `--disable-extensions-except=${EXTENSION_PATH}`,
    `--load-extension=${EXTENSION_PATH}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--password-store=basic', // Avoid system keychain
    '--use-mock-keychain',
    '--disable-component-update',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader', // Use software rendering for consistency if desired, or comment out for performance
  ];

  if (options.headless) {
    // Note: Extensions don't work in old headless mode, but Playwright handles 'new' headless
  }

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false, // Must be false for extension to work properly in most cases
    args,
    ignoreDefaultArgs: ['--disable-extensions'],
    viewport: null, // Allow screen protection to take effect
  });

  return context;
}

module.exports = { launchBrowser, USER_DATA_DIR };
