import {
  chromium,
  Browser,
  Page,
  LaunchOptions,
  BrowserContextOptions,
} from 'playwright';

export class BrowserManager {
  private browser: Browser | null = null;
  private readonly launchOptions: LaunchOptions;

  constructor(options: LaunchOptions = { headless: true }) {
    this.launchOptions = options;
  }

  /**
   * Get the browser instance
   */
  private async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch(this.launchOptions);
    }
    return this.browser;
  }

  /**
   * Create a new page
   */
  async newPage(options?: BrowserContextOptions): Promise<Page> {
    const browser = await this.getBrowser();
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      ...options,
    });
    return context.newPage();
  }

  /**
   * Close the browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
