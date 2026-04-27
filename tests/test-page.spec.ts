import { test, expect, Page, Request } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun/';
const UMAMI_ENDPOINT = '/api/send';

test.setTimeout(60000);

async function waitForTracking(page: Page): Promise<Request> {
    return await page.waitForRequest(req =>
        req.url().includes(UMAMI_ENDPOINT)
    );
}

function parseRaw(req: Request) {
    try {
        return JSON.parse(req.postData() || '{}');
    } catch {
        return {};
    }
}

function getPayload(req: Request) {
    const raw = parseRaw(req);
    return raw.payload || {};
}

// ===============================
// CORE TRACKING TESTS
// ===============================

test('TC_01 - Track page view khi load trang', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});

test('TC_02 - Track đúng URL khi vào trang tournament', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('/tournament');
});

test('TC_03 - Track khi reload trang', async ({ page }) => {
    await page.goto(BASE_URL);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.reload(),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});

test('TC_04 - Track khi chuyển page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    const [req] = await Promise.all([
        page.waitForRequest(req =>
            req.url().includes(UMAMI_ENDPOINT) &&
            (req.postData() || '').includes('/tournament')
        ),
        page.goto(BASE_URL + 'tournament'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('/tournament');
});

// ===============================
// PAYLOAD VALIDATION
// ===============================
test('TC_05 - Payload chứa đầy đủ field quan trọng', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const raw = parseRaw(req);
    const payload = raw.payload;

    expect(raw.type).toBe('event');
    expect(payload).toHaveProperty('url');
    expect(payload).toHaveProperty('website');
    expect(payload).toHaveProperty('screen');
    expect(payload).toHaveProperty('hostname');
});

test('TC_06 - Referrer tồn tại và đúng kiểu dữ liệu', async ({ page }) => {
    await page.goto(BASE_URL);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    const payload = getPayload(req);

    expect(payload).toHaveProperty('referrer');
    expect(typeof payload.referrer).toBe('string');
});

// ===============================
// BEHAVIOR TESTS
// ===============================

test('TC_07 - Không spam tracking bất thường', async ({ page }) => {
    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(10);
});

test('TC_08 - Tracking không bị delay quá lâu', async ({ page }) => {
    const start = Date.now();

    await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const delay = Date.now() - start;
    expect(delay).toBeLessThan(20000);
});

// ===============================
// EDGE CASES
// ===============================

test('TC_09 - Tracking bị chặn bởi adblock', async ({ page }) => {
    await page.route('**/api/send', route => route.abort());

    await page.goto(BASE_URL);

    const failed = await page.waitForEvent('requestfailed', {
        predicate: (req: Request) => req.url().includes(UMAMI_ENDPOINT),
    });

    expect(failed).toBeTruthy();
});

test('TC_10 - Offline không gửi tracking', async ({ page, context }) => {
    await context.setOffline(true);

    let called = false;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) called = true;
    });

    try {
        await page.goto(BASE_URL);
    } catch {}

    expect(called).toBeFalsy();
});

test('TC_11 - Tracking không ảnh hưởng thời gian load trang', async ({ page }) => {
    const start = Date.now();

    await page.goto(BASE_URL);

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
});

// ===============================
// MULTI CONTEXT
// ===============================

test('TC_12 - Tracking hoạt động trên nhiều tab', async ({ browser }) => {
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

// ===============================
// ADDITIONAL TESTS
// ===============================

test('TC_13 - Track khi có query param', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + '?utm=test123'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('?utm=test123');
});

test('TC_14 - Track khi user chuyển nhiều page liên tiếp', async ({ page }) => {
    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    await page.goto(BASE_URL);
    await page.goto(BASE_URL + 'tournament');
    await page.goto(BASE_URL);

    expect(count).toBeGreaterThanOrEqual(2);
});

test('TC_15 - Track ổn định sau nhiều lần reload', async ({ page }) => {
    await page.goto(BASE_URL);

    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    for (let i = 0; i < 3; i++) {
        await Promise.all([
            waitForTracking(page),
            page.reload(),
        ]);
    }

    expect(count).toBeGreaterThanOrEqual(3);
});

test('TC_16 - Payload chứa hostname đúng', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.hostname).toContain('platform.cupzone.fun');
});

test('TC_17 - Payload chứa thông tin screen', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.screen).toMatch(/\d+x\d+/);
});

test('TC_18 - Không duplicate tracking trong thời gian ngắn', async ({ page }) => {
    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    await page.goto(BASE_URL);

    await page.waitForTimeout(2000);

    expect(count).toBeLessThan(5);
});

test('TC_19 - Tracking hoạt động lại sau khi online trở lại', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');

    await page.context().setOffline(true);
    await page.waitForTimeout(1000);
    await page.context().setOffline(false);

    const [req] = await Promise.all([
        page.waitForRequest(
            r => r.url().includes(UMAMI_ENDPOINT),
            { timeout: 30000 }
        ),
        page.reload(),
    ]);

    const payload = getPayload(req);
    expect(payload).toBeTruthy();
});

test('TC_20 - Track khi mở tab mới', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});