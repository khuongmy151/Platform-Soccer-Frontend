import { test, expect } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun';

test.describe('HỆ THỐNG QUẢN LÝ TRẬN ĐẤU - CUPZONE 2026', () => {

    // =========================================================
    // 1. GUEST FLOW - TRƯỚC KHI LOGIN (HAPPY CASE)
    // =========================================================

    test('TC00: Khách xem danh sách Tournament chi tiết', async ({ page }) => {
        await page.goto(BASE_URL);

        // 1. Đợi trang load và đảm bảo danh sách giải đấu đã hiện ra
        const firstTournamentCard = page.locator('div').filter({ has: page.getByText(/DETAILS/i) }).first();

        await firstTournamentCard.waitFor({ state: 'visible', timeout: 15000 });

        // 2. Click vào nguyên cái khung (card)
        await firstTournamentCard.click();

        // 3. KIỂM TRA:
        const body = page.locator('body');
        await expect(body).toContainText(/MATCHUP|SCHEDULE|No matches scheduled/i, { timeout: 10000 });

        console.log("Đã bấm vào khung và mở chi tiết thành công!");
    });

    // =========================================================
    // 2. ADMIN FLOW - SAU KHI LOGIN (HAPPY CASES)
    // =========================================================

    test.describe('Quản lý Trận đấu (Yêu cầu Login)', () => {

        test.beforeEach(async ({ page }) => {
            await page.route(url => url.href.includes('tournament'), async (route) => {
                console.log('Đã tóm được: ' + route.request().url());
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        data: [
                            {
                                id: 1,
                                name: 'Cupzone Tournament 2026',
                                status: 'UPCOMING',
                                startDate: '2026-07-01',
                                type: 'LEAGUE'
                            }
                        ]
                    }),
                });
            });
                // 1. Login
                await page.goto(`${BASE_URL}/login`);
                await page.getByPlaceholder(/email/i).fill('minhngoc1907204@gmail.com');
                await page.getByPlaceholder(/password/i).fill('12345678');

                // 2. Click Login và ĐỢI URL THAY ĐỔI
                await page.getByRole('button', { name: 'Login', exact: true }).click();

                await page.waitForURL(url => !url.href.includes('login'), { timeout: 15000 });

                // 3. Kiểm tra Sidebar (Dùng locator linh hoạt hơn cho chắc ăn)
                const sidebar = page.locator('aside, [class*="sidebar"], nav').first();
                await expect(sidebar).toBeVisible({ timeout: 15000 });

                // 4. Chuyển sang trang Tournament
                await page.getByRole('link', { name: /Tournaments/i }).click();

                await page.waitForLoadState('networkidle');

                // 5. Tìm nút LIST MATCH (Sửa lại locator cho chuẩn xác nhất)
                const listMatchBtn = page.locator('div')
                    .filter({ hasText: /CUPZONE TOURNAMENT 2026/i })
                    .getByRole('button', { name: /LIST MATCH/i })
                    .first();

                await expect(listMatchBtn).toBeVisible({ timeout: 15000 });
                await listMatchBtn.click();

                // 6. Đợi URL sang trang Matches
                await expect(page).toHaveURL(/.*\/matches\/1/, { timeout: 10000 });
        });

        test('TC01: Kiểm tra hiển thị tiêu đề trang Match List', async ({page}) => {
            await expect(page.locator('h1')).toContainText(/Match List/i);
        });

        test('TC02: Kiểm tra nút tạo trận đấu mới', async ({page}) => {
            await page.waitForLoadState('networkidle');

            const createBtn = page.getByRole('button', {name: /CREATE MATCH/i});
            await expect(createBtn).toBeVisible({timeout: 7000});
        });

        test('TC03: Kiểm tra hiển thị tên đội bóng', async ({page}) => {
            // 1. Khoanh vùng trong 'main' để né Sidebar
            const main = page.locator('main');

            // 2. Tìm thẳng cái text nào là "TEAM ALPHA" (hoặc dùng Regex tên đội)
            const teamName = main.getByText(/TEAM [A-Z]+/).first();

            // 3. Dùng toHaveText thay vì waitFor để Playwright in nội dung ra Action Log
            await expect(teamName).toHaveText(/TEAM [A-Z]+/);

            console.log(`Đã tìm thấy tên đội: ${await teamName.innerText()}`);
        });

        test('TC04: Kiểm tra định dạng ngày thi đấu (VD: OCT 24, 2024)', async ({page}) => {
            // 1. Tìm phần tử chứa định dạng ngày tháng: 3 chữ in hoa + khoảng trắng + số + phẩy + năm
            const dateRegex = /[A-Z]{3}\s\d{1,2},\s\d{4}/;
            const dateText = page.getByText(dateRegex).first();

            // 2. Chờ cho phần tử này xuất hiện (timeout 7s để tránh lag mạng/API chậm)
            await dateText.waitFor({state: 'visible', timeout: 7000});

            // 3. Kiểm tra nội dung có khớp hoàn toàn với định dạng không
            await expect(dateText).toHaveText(dateRegex);

            console.log(`Log TC04 - Ngày thi đấu tìm thấy: ${await dateText.innerText()}`);
        });

        test('TC05: Kiểm tra định dạng giờ thi đấu (dấu ":" và GMT)', async ({page}) => {
            // 1. Tìm phần tử chứa chữ "GMT" bất kể nó nằm trong thẻ nào
            const timeText = page.getByText(/\d{1,2}:\d{2}\s*GMT/).first();

            // 2. Chờ cho phần tử xuất hiện rõ ràng (timeout 7s để tránh lag mạng)
            await timeText.waitFor({state: 'visible', timeout: 7000});

            // 3. Kiểm tra nội dung
            await expect(timeText).toHaveText(/\d{1,2}:\d{2}\s*GMT/);

            console.log(`Log TC05 - Giờ thi đấu tìm thấy: ${await timeText.innerText()}`);
        });

        test('TC06: Kiểm tra Badge trạng thái trận đấu', async ({page}) => {
            const statusBadge = page.getByText(/SCHEDULED|LIVE|FINISHED|CANCELLED/i).first();

            await statusBadge.waitFor({state: 'visible'});

            await expect(statusBadge).toBeVisible();

            console.log(`Trạng thái tìm thấy: ${await statusBadge.innerText()}`);
        });

        test('TC07: Kiểm tra hiển thị Tỉ số (X - Y) hoặc chữ VS', async ({page}) => {
            // 1. Đợi trang load xong
            await page.waitForLoadState('networkidle');

            // 2. Tìm phần tử CHỈ CHỨA DUY NHẤT chữ "VS" hoặc định dạng "Số - Số"
            const centralElement = page.locator('span, p, div').filter({
                hasText: /^VS$|^\d+\s*-\s*\d+$/
            }).first();

            // 3. Đợi nó hiện hình
            await centralElement.waitFor({state: 'visible', timeout: 10000});

            // 4. Lấy text và kiểm tra
            const content = await centralElement.innerText();

            const cleanContent = content.trim();

            if (cleanContent === 'VS') {
                console.log('--- Trận đấu: SCHEDULED (VS) ---');
                expect(cleanContent).toBe('VS');
            } else {
                console.log(`--- Trận đấu: LIVE/FINISHED (Tỉ số: ${cleanContent}) ---`);
                expect(cleanContent).toMatch(/^\d+\s*-\s*\d+$/);
            }
        });

        test('TC08: Kiểm tra thông tin địa điểm (Stadium/Venue)', async ({page}) => {
            const venue = page.getByText(/STADIUM|WEMBLEY|SANTIAGO/i).first();

            await venue.waitFor({state: 'visible', timeout: 7000});

            await expect(venue).toBeVisible();

            console.log("Địa điểm tìm thấy: ", await venue.innerText());
        });

        test('TC09: Kiểm tra chức năng nút START MATCH', async ({page}) => {
            const startBtn = page.getByRole('button', {name: /START MATCH/i}).first();
            if (await startBtn.isVisible()) {
                await startBtn.click();
                await expect(page.getByText(/LIVE NOW/i).first()).toBeVisible();
            }
        });

        test('TC10: Kiểm tra điều hướng VIEW MATCH DETAILS', async ({page}) => {
            const viewBtn = page.getByRole('button', {name: /VIEW MATCH DETAILS/i}).first();
            if (await viewBtn.isVisible()) {
                await viewBtn.click();
                await expect(page).toHaveURL(/.*\/match.*/);
            }
        });

        test('TC11: Kiểm tra hiển thị nút LOAD MORE MATCHES', async ({page}) => {
            await expect(page.getByRole('button', {name: /LOAD MORE/i})).toBeVisible();
        });

        test('TC12: Kiểm tra hiển thị Sidebar (Đúng Layout)', async ({page}) => {
            await expect(page.locator('aside').first()).toBeVisible();
        });
        test('TC13: Luồng Tạo trận đấu mới', async ({ page }) => {
                // 1. MOCK DATA (Giữ nguyên phần route mock của ní)
                await page.route(url => url.href.includes('team'), async (route) => {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify([
                            { id: 'team-a-id', name: 'TEAM ALPHA' },
                            { id: 'team-b-id', name: 'TEAM BRAVO' }
                        ]),
                    });
                });

                // 2. Nhấn nút CREATE MATCH (Lúc này đang ở /matches/1 rồi nhờ beforeEach)
                const createBtn = page.getByRole('button', { name: 'CREATE MATCH' });
                await expect(createBtn).toBeVisible({ timeout: 10000 });
                await createBtn.click();

                // 3. KIỂM TRA ROUTE MỚI: Phải nhảy sang trang tạo (match/:id/create)
                await expect(page).toHaveURL(/.*\/match\/\d+\/create/);

                // 4. Chọn Team A & B (Giữ nguyên logic waitForFunction của ní)
                const selectTeamA = page.getByRole('combobox').first();
                await page.waitForFunction(sel => sel.options.length > 1, await selectTeamA.elementHandle());
                await selectTeamA.selectOption('team-a-id');

                const selectTeamB = page.getByRole('combobox').nth(1);
                await page.waitForFunction(sel => sel.options.length > 1, await selectTeamB.elementHandle());
                await selectTeamB.selectOption('team-b-id');

                // 5. Điền form
                await page.getByRole('textbox', { name: /Match #/i }).fill('Mock Match ' + Date.now());
                await page.getByRole('combobox').nth(2).selectOption({ index: 1 }); // Venue
                await page.locator('input[type="date"]').fill('2026-04-22');
                await page.locator('input[type="time"]').fill('19:30');

                const saveBtn = page.getByRole('button', { name: /CREATE MATCH|SAVE/i }).last();
                await saveBtn.click();

                await expect(page.locator('h1')).toContainText(/CREATE TACTICAL MATCH/i, { timeout: 10000 });
        });
    });

    // =========================================================
    // 3. UNHAPPY CASES - KIỂM TRA LỖI RÀNG BUỘC
    // =========================================================

    test.describe('Unhappy Cases: Kiểm tra Bảo mật & Ràng buộc', () => {

        test('TC_14: Truy cập Match List khi chưa Login (Bảo mật)', async ({page}) => {
            await page.goto(`${BASE_URL}/matches/1`);
            // Mong đợi: Bị đá về trang login
            await expect(page).toHaveURL(/.*login/);
        });
    });
});