import { PlaywrightTestConfig, devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests',
  timeout: 20 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: 2,
  reporter: [['list'], ['html'], ['junit', { outputFile: 'results.xml' }]],
  use: {
    permissions: ['clipboard-read', 'clipboard-write'],
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on-first-retry',
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm start',
    port: 3000,
    timeout: 60 * 1000,
    reuseExistingServer: true,
  },
};

export default config;
