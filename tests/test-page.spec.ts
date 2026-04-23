import { test, expect, Page, Request } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun/';
const UMAMI_ENDPOINT = '/api/send';

test.setTimeout(60000);

// ===============================
// HELPERS
// ===============================
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

// TC_01
test('TC_01 - Track page view khi load trang', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});

// TC_02
test('TC_02 - Track đúng URL khi vào trang tournament', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('/tournament');
});

// TC_03
test('TC_03 - Track khi reload trang', async ({ page }) => {
    await page.goto(BASE_URL);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.reload(),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});

// TC_04
test('TC_04 - Track khi chuyển page', async ({ page }) => {
    await page.goto(BASE_URL);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + 'tournament'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('/tournament');
});

// ===============================
// PAYLOAD VALIDATION
// ===============================

// TC_05
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

// TC_06
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

// TC_07
test('TC_07 - Không spam tracking bất thường', async ({ page }) => {
    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    await page.goto(BASE_URL);

    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(10);
});

// TC_08
test('TC_08 - Tracking không bị delay quá lâu', async ({ page }) => {
    const start = Date.now();

    await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const delay = Date.now() - start;
    expect(delay).toBeLessThan(10000);
});

// ===============================
// EDGE CASES
// ===============================

// TC_09
test('TC_09 - Tracking bị chặn bởi adblock', async ({ page }) => {
    await page.route('**/api/send', route => route.abort());

    await page.goto(BASE_URL);

    const failed = await page.waitForEvent('requestfailed', {
        predicate: (req: Request) => req.url().includes(UMAMI_ENDPOINT),
    });

    expect(failed).toBeTruthy();
});

// TC_10
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

// TC_11
test('TC_11 - Tracking không ảnh hưởng thời gian load trang', async ({ page }) => {
    const start = Date.now();

    await page.goto(BASE_URL);

    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(10000);
});

// ===============================
// MULTI CONTEXT
// ===============================

// TC_12
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

// TC_13
test('TC_13 - Track khi có query param', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL + '?utm=test123'),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toContain('?utm=test123');
});

// TC_14
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

// TC_15
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

// TC_16
test('TC_16 - Payload chứa hostname đúng', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.hostname).toContain('platform.cupzone.fun');
});

// TC_17
test('TC_17 - Payload chứa thông tin screen', async ({ page }) => {
    const [req] = await Promise.all([
        waitForTracking(page),
        page.goto(BASE_URL),
    ]);

    const payload = getPayload(req);
    expect(payload.screen).toMatch(/\d+x\d+/);
});

// TC_18
test('TC_18 - Không duplicate tracking trong thời gian ngắn', async ({ page }) => {
    let count = 0;

    page.on('request', (req: Request) => {
        if (req.url().includes(UMAMI_ENDPOINT)) count++;
    });

    await page.goto(BASE_URL);

    await page.waitForTimeout(2000);

    expect(count).toBeLessThan(5);
});

// TC_19
test('TC_19 - Tracking hoạt động lại sau khi online trở lại', async ({ page, context }) => {
    await context.setOffline(true);

    try {
        await page.goto(BASE_URL);
    } catch {}

    await context.setOffline(false);

    const [req] = await Promise.all([
        waitForTracking(page),
        page.reload(),
    ]);

    const payload = getPayload(req);
    expect(payload.url).toBeTruthy();
});

// TC_20
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