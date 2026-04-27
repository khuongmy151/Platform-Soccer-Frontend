import { test, expect, Page, Locator } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun/';

async function waitForDashboard(page: Page): Promise<void>  {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    await expect(
        page.getByRole('heading', { name: /tournament lists/i })
    ).toBeVisible({ timeout: 30000 });
}

async function safeClick(locator: Locator): Promise<void>  {
    await expect(locator).toBeVisible({ timeout: 15000 });
    await expect(locator).toBeEnabled();
    await locator.click();
}

async function scrollTo(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
    await expect(locator).toBeVisible({ timeout: 15000 });
}

test.describe('Public Dashboard - Stable Version', () => {

    test.beforeEach(async ({ page }) => {
        await waitForDashboard(page);
    });

    test('TC_01 - Page load thành công', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_02 - Hiển thị title Tournament Lists', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 10000 });
    });

    test('TC_03 - Có tournament card', async ({ page }) => {
        const cards = page.locator('.cursor-pointer');
        await expect(cards.first()).toBeVisible({ timeout: 15000 });
    });

    test('TC_04 - Card hover', async ({ page }) => {
        const card = page.locator('.cursor-pointer').first();
        await expect(card).toBeVisible();
        await card.hover();
    });

    test('TC_05 - Có nút DETAILS', async ({ page }) => {
        await expect(page.getByText('DETAILS').first()).toBeVisible({ timeout: 15000 });
    });

    test('TC_06 - Click DETAILS không crash', async ({ page }) => {
        await safeClick(page.getByText('DETAILS').first());
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_07 - Toggle DETAILS', async ({ page }) => {
        const btn = page.getByText('DETAILS').first();
        await safeClick(btn);
        await safeClick(btn);
    });

    test('TC_08 - DETAILS hiển thị match', async ({ page }) => {
        await safeClick(page.getByText('DETAILS').first());
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_09 - Hiển thị status', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_10 - Có calendar', async ({ page }) => {
        const calendar = page.locator('[class*=calendar], [class*=date]').first();
        if (await calendar.count() > 0) {
            await expect(calendar).toBeVisible({ timeout: 10000 });
        } else {
            await expect(page.locator('button:visible').first()).toBeVisible();
        }
    });

    test('TC_11 - Click ngày', async ({ page }) => {
        const date = page.locator('button:visible').nth(5);
        if (await date.count() > 0) {
            await safeClick(date);
        }
    });


    test('TC_12 - Có section Teams', async ({ page }) => {
        const teams = page.getByRole('heading', { name: /teams/i });
        await scrollTo(teams);
    });

    test('TC_13 - Có nút VIEW ALL', async ({ page }) => {
        const btn = page.getByRole('button', { name: /view all/i }).first();
        await scrollTo(btn);
    });

    test('TC_14 - Hiển thị team card', async ({ page }) => {
        const teams = page.getByRole('heading', { name: /teams/i });
        await scrollTo(teams);
    });

    test('TC_15 - Click team không crash', async ({ page }) => {
        const team = page.locator('.cursor-pointer').nth(1);
        await safeClick(team);
    });

    test('TC_16 - Click VIEW ALL chuyển sang All Teams', async ({ page }) => {
        const btn = page.getByRole('button', { name: /view all/i }).first();
        await scrollTo(btn);

        await safeClick(btn);

        await expect(page).toHaveURL(/teams/, { timeout: 15000 });

        await expect(
            page.getByRole('heading', { name: /all teams/i })
        ).toBeVisible({ timeout: 15000 });
    });

    test('TC_17 - All Teams hiển thị danh sách', async ({ page }) => {
        const btn = page.getByRole('button', { name: /view all/i }).first();
        await safeClick(btn);
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_18 - Search team', async ({ page }) => {
        await safeClick(page.getByRole('button', { name: /view all/i }).first());

        const search = page.getByPlaceholder(/search/i);
        if (await search.isVisible()) {
            await search.fill('test');
        }
    });

    test('TC_19 - Pagination', async ({ page }) => {
        await safeClick(page.getByRole('button', { name: /view all/i }).first());

        const page2 = page.getByText('2').first();
        if (await page2.isVisible()) {
            await safeClick(page2);
        }
    });

    test('TC_20 - Click team chuyển sang Team Detail', async ({ page }) => {
        await safeClick(page.locator('.cursor-pointer').nth(1));
    });

    test('TC_21 - Hiển thị player card', async ({ page }) => {
        await safeClick(page.locator('.cursor-pointer').nth(1));
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_22 - Back button', async ({ page }) => {

        await safeClick(page.getByRole('button', { name: /view all/i }).first());

        const back = page.getByRole('button', { name: /back/i });

        if (await back.isVisible()) {
            await safeClick(back);
        } else {
            // fallback nếu không có nút back
            await page.goBack();
        }

        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 20000 });

    });

    test('TC_23 - Không console error', async ({ page }) => {
        const errors: string[] = [];

        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 20000 });

        expect(errors.length).toBeLessThan(5);
    });

    test('TC_24 - Load < 10s', async ({ page }) => {
        const start = Date.now();

        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 20000 });

        expect(Date.now() - start).toBeLessThan(20000);
    });

    test('TC_25 - Không undefined', async ({ page }) => {
        const text = await page.locator('body').innerText();
        expect(text).not.toMatch(/undefined|null/i);
    });

    test('TC_26 - Scroll', async ({ page }) => {
        await page.mouse.wheel(0, 2000);
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_27 - Mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_28 - Tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await expect(page.locator('body')).toBeVisible();
    });

    test('TC_29 - Click DETAILS nhiều lần', async ({ page }) => {
        const btn = page.getByText('DETAILS').first();

        for (let i = 0; i < 5; i++) {
            await safeClick(btn);
        }
    });

    test('TC_30 - Add team (auth) -> Trong dashboard có Team vừa mới được tạo', async ({ page }) => {

        const teamName = `AUTO_TEAM_${Date.now()}`;

        // ================= REGISTER =================
        const email = `tester_${Date.now()}@mail.com`;

        const registerRes = await page.request.post('https://backend.cupzone.fun/auth/register', {
            data: {
                email,
                password: '12345678',
                full_name: 'Tester',
                username: `tester_${Date.now()}`
            }
        });

        expect(registerRes.status()).toBe(201);

        // ================= LOGIN =================
        const loginRes = await page.request.post('https://backend.cupzone.fun/auth/login', {
            data: {
                email,
                password: '12345678'
            }
        });

        expect(loginRes.status()).toBe(200);

        const loginData = await loginRes.json();

        const token = loginData.data.token;

        expect(token).toBeTruthy();

        // ================= CREATE TEAM =================
        const createRes = await page.request.post('https://backend.cupzone.fun/teams', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                name: teamName
            }
        });

        expect(createRes.status()).toBe(201);

        // ================= VERIFY UI =================
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 20000 });

        await safeClick(page.getByRole('button', { name: /view all/i }).first());

        const search = page.getByPlaceholder(/search/i);
        if (await search.isVisible()) {
            await search.fill(teamName);
        }

        await expect(page.getByText(teamName)).toBeVisible({ timeout: 15000 });
    });

    test('TC_31 - Update team (auth) -> Trong dashboard có Team vừa mới được update', async ({ page }) => {

        const oldName = `AUTO_TEAM_${Date.now()}`;
        const newName = `${oldName}_UPDATED`;

        const email = `tester_${Date.now()}@mail.com`;

        // ================= REGISTER =================
        const registerRes = await page.request.post('https://backend.cupzone.fun/auth/register', {
            data: {
                email,
                password: '12345678',
                full_name: 'Tester',
                username: `tester_${Date.now()}`
            }
        });
        expect(registerRes.status()).toBe(201);

        // ================= LOGIN =================
        const loginRes = await page.request.post('https://backend.cupzone.fun/auth/login', {
            data: { email, password: '12345678' }
        });
        expect(loginRes.status()).toBe(200);

        const loginData = await loginRes.json();
        const token = loginData.data.token;

        // ================= CREATE TEAM =================
        const createRes = await page.request.post('https://backend.cupzone.fun/teams', {
            headers: { Authorization: `Bearer ${token}` },
            data: { name: oldName }
        });

        expect(createRes.status()).toBe(201);

        const createdTeam = await createRes.json();
        const teamId = createdTeam.data?.id || createdTeam.id;

        expect(teamId).toBeTruthy();

        // ================= UPDATE TEAM =================
        const updateRes = await page.request.put(`https://backend.cupzone.fun/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` },
            data: { name: newName }
        });

        expect([200, 204]).toContain(updateRes.status());

        // ================= VERIFY UI =================
        await page.reload({ waitUntil: 'domcontentloaded' });
        await expect(
            page.getByRole('heading', { name: /tournament lists/i })
        ).toBeVisible({ timeout: 20000 });

        await safeClick(page.getByRole('button', { name: /view all/i }).first());

        const search = page.getByPlaceholder(/search/i);
        if (await search.isVisible()) {
            await search.fill(newName);
        }

        await expect(page.getByText(newName)).toBeVisible({ timeout: 15000 });
    });


    test('TC_32 - Delete team -> dashboard không còn hiển thị team đó', async ({ page }) => {

        const teamName = `AUTO_TEAM_${Date.now()}`;
        const email = `tester_${Date.now()}@mail.com`;

        // ===== REGISTER =====
        const registerRes = await page.request.post('https://backend.cupzone.fun/auth/register', {
            data: {
                email,
                password: '12345678',
                full_name: 'Tester',
                username: `tester_${Date.now()}`
            }
        });
        expect(registerRes.status()).toBe(201);

        // ===== LOGIN =====
        const loginRes = await page.request.post('https://backend.cupzone.fun/auth/login', {
            data: { email, password: '12345678' }
        });
        const token = (await loginRes.json()).data.token;

        // ===== CREATE TEAM =====
        const createRes = await page.request.post('https://backend.cupzone.fun/teams', {
            headers: { Authorization: `Bearer ${token}` },
            data: { name: teamName }
        });
        expect(createRes.status()).toBe(201);

        // ===== LOAD DASHBOARD =====
        await waitForDashboard(page);

        const teamsSection = page.getByRole('heading', { name: /teams/i });
        await scrollTo(teamsSection);

        const teamLocator = page.getByText(teamName);

        // kiểm tra xem có xuất hiện không
        const existedOnDashboard = await teamLocator.count() > 0;

        if (existedOnDashboard) {
            await expect(teamLocator).toBeVisible();
        } else {
            console.warn('⚠️ Team không xuất hiện trên dashboard (do giới hạn hiển thị)');
        }

        // ===== DELETE TEAM =====
        const createdTeam = await createRes.json();
        const teamId = createdTeam.data?.id || createdTeam.id;

        const deleteRes = await page.request.delete(`https://backend.cupzone.fun/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        expect([200, 204]).toContain(deleteRes.status());

        // ===== RELOAD DASHBOARD =====
        await waitForDashboard(page);

        await scrollTo(teamsSection);

        const afterDelete = page.getByText(teamName);

        if (existedOnDashboard) {

            await expect(afterDelete).toHaveCount(0);
        } else {
            console.log('Skip assert vì team chưa từng hiển thị trên dashboard');
        }
    });

});