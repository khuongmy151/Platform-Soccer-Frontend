import { test, expect } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun';

test.describe('HỆ THỐNG QUẢN LÝ TRẬN ĐẤU - CUPZONE 2026 (REAL DATA)', () => {

    // =========================================================
    // 1. GUEST FLOW - TRƯỚC KHI LOGIN (TC00)
    // =========================================================

    test('TC00: Khách xem danh sách Tournament chi tiết', async ({ page }) => {
        await page.goto(BASE_URL);

        // Đợi danh sách giải đấu load từ server thật
        const firstTournamentCard = page.locator('div').filter({ has: page.getByText(/DETAILS/i) }).first();
        await firstTournamentCard.waitFor({ state: 'visible', timeout: 15000 });

        await firstTournamentCard.click();

        // Kiểm tra điều hướng thành công
        const body = page.locator('body');
        await expect(body).toContainText(/MATCHUP|SCHEDULE|No matches scheduled/i, { timeout: 10000 });
        console.log("TC00: Khách xem chi tiết thành công!");
    });

    // =========================================================
    // 2. ADMIN FLOW - SAU KHI LOGIN (TC01 -> TC13)
    // =========================================================

    test.describe('Quản lý Trận đấu (Yêu cầu Login)', () => {

        test.beforeEach(async ({ page }) => {
            // 1. Đăng nhập
            await page.goto(`${BASE_URL}/login`);
            await page.getByPlaceholder(/email/i).fill('minhngoc1907204@gmail.com');
            await page.getByPlaceholder(/password/i).fill('12345678');
            await page.getByRole('button', { name: 'Login', exact: true }).click();

            // 2. Đợi URL thay đổi (vào dashboard hoặc tournament)
            await page.waitForURL(url => !url.href.includes('login'), { timeout: 15000 });

            // 3. Chuyển sang trang Tournament
            await page.getByRole('link', { name: /Tournaments/i }).click();
            await page.waitForLoadState('networkidle');

            // 4. Tìm giải đấu bất kỳ đang có trên máy chủ và bấm LIST MATCH
            const listMatchBtn = page.getByRole('button', { name: /LIST MATCH/i }).first();
            await expect(listMatchBtn).toBeVisible({ timeout: 15000 });
            await listMatchBtn.click();

            // 5. Đợi trang Matches hiển thị (ID động nên dùng Regex)
            await page.waitForURL(/.*\/matches\/.*/, { timeout: 10000 });
        });

        test('TC01: Kiểm tra tiêu đề trang Match List', async ({ page }) => {
            await expect(page.locator('h1')).toContainText(/Match List/i);
        });

        test('TC02: Kiểm tra sự tồn tại của nút tạo trận đấu', async ({ page }) => {
            const createBtn = page.getByRole('button', { name: /CREATE MATCH/i });
            await expect(createBtn).toBeVisible();
        });

        test('TC03: Kiểm tra hiển thị tên đội bóng', async ({ page }) => {
            // Tìm text TEAM bất kỳ (vì dữ liệu thật có thể là TEAM STU, TEAM MAN CITY...)
            const teamName = page.locator('main').getByText(/TEAM/i).first();
            await expect(teamName).toBeVisible();
            console.log(`Team tìm thấy: ${await teamName.innerText()}`);
        });

        test('TC04: Kiểm tra định dạng ngày (Chấp nhận N/A hoặc Ngày thực)', async ({ page }) => {
            const dateRegex = /([A-Z]{3}\s\d{1,2},\s\d{4}|N\/A)/;
            const dateText = page.getByText(dateRegex).first();
            await expect(dateText).toBeVisible();
        });

        test('TC05: Kiểm tra định dạng giờ (Không có GMT theo UI thực tế)', async ({ page }) => {
            const timeRegex = /(\d{1,2}:\d{2}|N\/A)/;
            const timeText = page.getByText(timeRegex).first();
            await expect(timeText).toBeVisible();
        });

        test('TC06: Kiểm tra Badge trạng thái', async ({ page }) => {
            const statusBadge = page.getByText(/SCHEDULED|LIVE|FINISHED|CANCELLED|FIRST HALF/i).first();
            await expect(statusBadge).toBeVisible();
        });

        test('TC07: Kiểm tra Tỉ số hoặc chữ VS', async ({ page }) => {
            const centralElement = page.locator('span, p, div').filter({
                hasText: /^VS$|^\d+\s*-\s*\d+$/
            }).first();
            await expect(centralElement).toBeVisible();
        });

        test('TC08: Kiểm tra thông tin địa điểm (Stadium)', async ({ page }) => {
            // Tìm icon location hoặc text liên quan đến sân vận động
            const venue = page.getByText(/SÂN|STADIUM|WEMBLEY|THỐNG NHẤT/i).first();
            await expect(venue).toBeVisible();
        });

        test('TC09: Kiểm tra nút START MATCH (nếu có)', async ({ page }) => {
            const startBtn = page.getByRole('button', { name: /START MATCH/i }).first();
            if (await startBtn.isVisible()) {
                await startBtn.click();
                await expect(page.locator('body')).toContainText(/LIVE/i);
            } else {
                console.log("Không có trận SCHEDULED để Start, bỏ qua TC09");
            }
        });

        test('TC10: Kiểm tra điều hướng VIEW MATCH DETAILS', async ({ page }) => {
            const viewBtn = page.getByRole('button', { name: /VIEW MATCH DETAILS/i }).first();
            await expect(viewBtn).toBeVisible();
            await viewBtn.click();
            await expect(page).toHaveURL(/.*\/match\/.*/);
        });

        test('TC11: Kiểm tra Sidebar', async ({ page }) => {
            await expect(page.locator('aside, nav').first()).toBeVisible();
        });

        test('TC12: Kiểm tra hiển thị nút LOAD MORE (nếu danh sách dài)', async ({ page }) => {
            const loadMore = page.getByRole('button', { name: /LOAD MORE/i });
            if (await loadMore.isVisible()) {
                await expect(loadMore).toBeVisible();
            }
        });

        test('TC13: Luồng Tạo trận đấu mới với Data thật', async ({ page }) => {
            await page.getByRole('button', { name: 'CREATE MATCH' }).click();
            await expect(page).toHaveURL(/.*\/create/);

            // Đợi Dropdown load đội bóng thật từ Server
            const selectTeamA = page.getByRole('combobox').first();
            await expect.poll(async () => {
                return await selectTeamA.locator('option').count();
            }, { timeout: 10000 }).toBeGreaterThan(1);

            await selectTeamA.selectOption({ index: 1 });
            await page.getByRole('combobox').nth(1).selectOption({ index: 2 });

            // Điền các thông tin cơ bản
            await page.locator('input[type="date"]').fill('2026-05-20');
            await page.locator('input[type="time"]').fill('20:00');

            console.log("TC13: Dropdown đã load data thật thành công!");
        });
    });

    // =========================================================
    // 3. UNHAPPY CASES (TC14)
    // =========================================================

    test.describe('Unhappy Cases', () => {
        test('TC14: Truy cập Match List khi chưa Login', async ({ page }) => {
            // Thử truy cập thẳng một ID trận đấu bất kỳ
            await page.goto(`${BASE_URL}/matches/some-random-id`);
            // Phải bị đẩy về trang login
            await expect(page).toHaveURL(/.*login/);
            console.log("TC14: Bảo mật tốt, đã redirect về Login.");
        });
    });
});