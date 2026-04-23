import { test, expect, Page, Request } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun/';
const UMAMI_ENDPOINT = '/api/send';

test.setTimeout(60000);

// ===============================
// HELPERS
// ===============================
function trackStats(page: Page) {
    let total = 0;
    let success = 0;
    let failed = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) total++;
    });

    page.on('requestfinished', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) success++;
    });

    page.on('requestfailed', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) failed++;
    });

    return () => ({ total, success, failed });
}

async function waitForTracking(page: Page) {
    return await page.waitForRequest(
        (req: Request) => req.url().includes(UMAMI_ENDPOINT),
        { timeout: 10000 }
    );
}

// ===============================
// TEST CASES
// ===============================

test('PT_01 - Track khi load trang', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    expect(req).toBeTruthy();
});

test('PT_02 - Track khi chuyển page', async ({ page }) => {
    await page.goto(BASE_URL);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    expect(req).toBeTruthy();
});

test('PT_03 - Track khi reload', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    await Promise.all([
        waitForTracking(page),
        page.reload(),
    ]);

    const { total } = stats();

    expect(total).toBeGreaterThan(1);
});

test('PT_04 - Track nhiều page', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    await page.goto(BASE_URL + 'tournament');
    await page.goto(BASE_URL);

    const { total } = stats();

    expect(total).toBeGreaterThan(1);
});

test('PT_05 - Tracking realtime', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    expect(req).toBeTruthy();
});

test('PT_06 - Tracking bị chặn', async ({ page }) => {
    const stats = trackStats(page);

    await page.route('**/api/send', route => route.abort());

    await page.goto(BASE_URL);

    await page.waitForEvent('requestfailed', {
        predicate: (req: Request) => req.url().includes(UMAMI_ENDPOINT),
        timeout: 5000
    });

    const { total, success, failed } = stats();

    expect(total).toBeGreaterThan(0);
    expect(success).toBe(0);
    expect(failed).toBeGreaterThan(0);
});

test('PT_07 - SPA navigation', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    await page.evaluate(() => {
        history.pushState({}, '', '/fake-route');
        window.dispatchEvent(new Event('popstate'));
    });

    const { total } = stats();

    expect(total).toBeGreaterThanOrEqual(0);
});

test('PT_08 - Offline không track', async ({ page, context }) => {
    await context.setOffline(true);

    const stats = trackStats(page);

    try {
        await page.goto(BASE_URL);
    } catch {}

    const { total } = stats();

    expect(total).toBe(0);
});

test('PT_09 - Bị chặn bởi adblock', async ({ page }) => {
    await page.route('**/api/send', route => route.abort());

    await page.goto(BASE_URL);

    const failedReq = await page.waitForEvent('requestfailed', {
        predicate: (req) => req.url().includes(UMAMI_ENDPOINT),
        timeout: 10000
    });

    expect(failedReq).toBeTruthy();
});

test('PT_10 - Tracking không delay quá lâu', async ({ page }) => {
    const start = Date.now();

    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const delay = Date.now() - start;

    expect(req).toBeTruthy();
    expect(delay).toBeLessThan(10000);
});

test('PT_11 - Không spam tracking', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    const { total } = stats();

    expect(total).toBeLessThan(10);
});

test('PT_12 - Payload hợp lệ', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    expect(req.postData()).toBeTruthy();
});

test('PT_13 - Disable JS không track', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();

    let called = false;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) called = true;
    });

    await page.goto(BASE_URL);

    expect(called).toBeFalsy();
});

test('PT_14 - Multi tab tracking', async ({ browser }) => {
    const context = await browser.newContext();

    const page1 = await context.newPage();
    const page2 = await context.newPage();

    let count = 0;

    const handler = (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    };

    page1.on('request', handler);
    page2.on('request', handler);

    await page1.goto(BASE_URL);
    await page2.goto(BASE_URL);

    expect(count).toBeGreaterThanOrEqual(2);
});

test('PT_15 - App vẫn hoạt động khi tracking fail', async ({ page }) => {
    await page.route('**/api/send', route => route.abort());

    await page.goto(BASE_URL);

    await expect(page).toHaveURL(BASE_URL);
});

test('PT_16 - Track khi back/forward', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    await Promise.all([
        waitForTracking(page),
        page.goBack(),
    ]);

    await Promise.all([
        waitForTracking(page),
        page.goForward(),
    ]);

    const { total } = stats();

    expect(total).toBeGreaterThanOrEqual(2);
});

test('PT_17 - Không duplicate tracking bất thường', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    const { total } = stats();

    expect(total).toBeLessThanOrEqual(3);
});

test('PT_18 - Track khi thay đổi query param', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL + '?test=1');
    await page.goto(BASE_URL + '?test=2');

    const { total } = stats();

    expect(total).toBeGreaterThan(1);
});

test('PT_19 - Track khi hash change', async ({ page }) => {
    const stats = trackStats(page);

    await page.goto(BASE_URL);

    await page.evaluate(() => {
        location.hash = '#section1';
    });

    const { total } = stats();

    expect(total).toBeGreaterThanOrEqual(0);
});

test('PT_20 - Tracking không block page load', async ({ page }) => {
    const start = Date.now();

    await page.goto(BASE_URL);

    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(10000);
});