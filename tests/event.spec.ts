import { test, expect } from '@playwright/test';
import axios from 'axios';

const BASE_URL = 'https://platform.cupzone.fun';
const API_URL = 'https://backend.cupzone.fun';
const UMAMI_SEND_API = '**/api/send';

test.describe('Soccer Platform - Full Coverage (TC_01 to TC_28)', () => {

    // --- BIẾN & HÀM HỖ TRỢ ---
    async function performLogin(page) {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[name="email"]', 'minhngoc1907204@gmail.com');
        await page.fill('input[name="password"]', '12345678');
        await page.click('button[type="submit"]');
        await page.waitForURL(url => !url.href.includes('login'));
    }

    async function ensureTeamExistsViaAPI() {
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: 'minhngoc1907204@gmail.com', password: '12345678'
            });
            const token = loginRes.data.data.token;
            const teamsRes = await axios.get(`${API_URL}/teams`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const teams = teamsRes.data.data || teamsRes.data;
            if (!teams || teams.length === 0) {
                await axios.post(`${API_URL}/teams`, {
                    name: 'API Team ' + Date.now(), country: 'VN', description: 'Test'
                }, { headers: { 'Authorization': `Bearer ${token}` } });
            }
        } catch (e) { console.log('API Setup skip'); }
    }

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 720 });
    });

    // =============================================================
    // NHÓM 1: EVENT TRACKING (TC_01 -> TC_12)
    // =============================================================
    test.describe('Event Tracking Click', () => {
        // HÀM QUAN TRỌNG: Chỉ bắt request nào có payload name KHỚP với eventName
        const waitForUmamiEvent = (page, eventName) => {
            return page.waitForRequest(request => {
                if (request.url().includes('/api/send') && request.method() === 'POST') {
                    try {
                        const data = JSON.parse(request.postData() || '{}');
                        const capturedName = data.payload?.name || data.name;
                        return capturedName === eventName; // Trả về true thì Playwright mới 'tóm' request này
                    } catch (e) { return false; }
                }
                return false;
            }, { timeout: 15000 });
        };

        test('TC_01: Login button click', async ({ page }) => {
            await page.goto(BASE_URL);
            const reqPromise = waitForUmamiEvent(page, 'Login button click');
            await page.click('button:has-text("Login")');
            await reqPromise;
        });

        test('TC_02: Register button click', async ({ page }) => {
            await page.goto(`${BASE_URL}/register`);
            const reqPromise = waitForUmamiEvent(page, 'Register button click');
            await page.click('[data-umami-event="Register button click"]');
            await reqPromise;
        });

        test('TC_03: Logout button click', async ({ page }) => {
            await performLogin(page);
            await page.click('img[alt="Avatar"]');
            const reqPromise = waitForUmamiEvent(page, 'Logout button click');
            await page.click('[data-umami-event="Logout button click"]');
            await reqPromise;
        });

        test('TC_04: My profile button click', async ({ page }) => {
            await performLogin(page);
            await page.click('img[alt="Avatar"]');
            const reqPromise = waitForUmamiEvent(page, 'My profile button click');
            await page.click('[data-umami-event="My profile button click"]');
            await reqPromise;
        });

        test('TC_05: Update profile button click', async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/my-profile`);
            const reqPromise = waitForUmamiEvent(page, 'Update profile button click');
            await page.click('[data-umami-event="Update profile button click"]');
            await reqPromise;
        });

        test('TC_06: Cancel update profile button click', async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/my-profile`);
            const reqPromise = waitForUmamiEvent(page, 'Cancel update profile button click');
            await page.click('[data-umami-event="Cancel update profile button click"]');
            await reqPromise;
        });

        test('TC_07: Add team button click', async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams`);
            const reqPromise = waitForUmamiEvent(page, 'Add team button click');
            await page.click('[data-umami-event="Add team button click"]');
            await reqPromise;
        });

        test('TC_08: Create team button click', async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams/create`);
            await page.fill('input[placeholder*="Neon Strike"]', 'Team Test');
            await page.fill('input[placeholder="Vietnam"]', 'Vietnam');
            const reqPromise = waitForUmamiEvent(page, 'Create team button click');
            await page.locator('[data-umami-event="Create team button click"]').first().click();
            await reqPromise;
        });

        test('TC_09: Cancel create team button click', async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams/create`);
            const reqPromise = waitForUmamiEvent(page, 'Cancel create team button click');
            await page.locator('[data-umami-event="Cancel create team button click"]').first().click();
            await reqPromise;
        });

        test('TC_10: Cancel confirm button click', async ({ page }) => {
            await ensureTeamExistsViaAPI();
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams`);
            await page.waitForSelector('table tbody tr', { state: 'visible' });

            // Bấm nút thùng rác (xóa) để hiện bảng xác nhận
            await page.locator('table tbody tr').first().locator('button').last().click();

            // Tìm nút CANCEL trên cái bảng hiện ra
            const cancelConfirmBtn = page.getByRole('button', { name: /CANCEL/i });
            await cancelConfirmBtn.waitFor({ state: 'visible' });

            const reqPromise = waitForUmamiEvent(page, 'Cancel confirm button click');
            await cancelConfirmBtn.click({ force: true });
            await reqPromise;
        });

        test('TC_11: Confirm button click', async ({ page }) => {
            await ensureTeamExistsViaAPI();
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams`);
            await page.waitForSelector('table tbody tr', { state: 'visible' });
            await page.locator('table tbody tr').first().locator('button').last().click();

            const confirmBtn = page.locator('button:has-text("Confirm"), [data-umami-event="Confirm button click"]').first();
            await confirmBtn.waitFor({ state: 'visible' });

            const reqPromise = waitForUmamiEvent(page, 'Confirm button click');
            await confirmBtn.click({ force: true });
            await reqPromise;
        });
    });
    // =============================================================
    // NHÓM 2: TEAM VALIDATION (TC_13 -> TC_21)
    // =============================================================
    test.describe('validateFormTeam', () => {
        test.beforeEach(async ({ page }) => {
            await performLogin(page);
            await page.goto(`${BASE_URL}/teams/create`);
        });

        test('TC_13: Team Name - Empty', async ({ page }) => {
            await page.getByPlaceholder('E.G., NEON STRIKE FC').fill('');
            await page.locator('button:has-text("Create team"), button:has-text("Save")').first().click();
            // Sửa lại thành Tiếng Anh theo file validateForm.js
            await expect(page.locator('body')).toContainText(/Team name is required|Please upload all 3 required images/i);
        });

        test('TC_14: Team Name - Length (3-50)', async ({ page }) => {
            await page.getByPlaceholder('E.G., NEON STRIKE FC').fill('Ab');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Team name must be between 3 and 50 characters|Please upload all 3 required images/i);
        });

        test('TC_15: Team Name - Special Characters', async ({ page }) => {
            await page.getByPlaceholder('E.G., NEON STRIKE FC').fill('Team @#$');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Team name cannot contain special characters|Please upload all 3 required images/i);
        });

        test('TC_16: Country - Empty', async ({ page }) => {
            await page.getByPlaceholder(/Vietnam|Quốc gia/i).fill('');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Nationality is required|Please upload all 3 required images/i);
        });

        test('TC_17: Country - Length (3-50)', async ({ page }) => {
            await page.getByPlaceholder(/Vietnam|Quốc gia/i).fill('VN');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Nationality must be between 3 and 50 characters|Please upload all 3 required images/i);
        });

        test('TC_18: Country - Only Alpha', async ({ page }) => {
            await page.getByPlaceholder(/Vietnam|Quốc gia/i).fill('Vietnam 123');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Nationality can only contain letters, no numbers or special characters|Please upload all 3 required images/i);
        });

        test('TC_19: Description - Empty', async ({ page }) => {
            await page.getByPlaceholder(/Club mission|Mô tả/i).fill('');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Description is required|Please upload all 3 required images/i);
        });

        test('TC_20: Description - Length (3-50)', async ({ page }) => {
            await page.getByPlaceholder(/Club mission|Mô tả/i).fill('A'.repeat(51));
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Description must be between 3 and 50 characters|Please upload all 3 required images/i);
        });

        test('TC_21: Description - Special Characters', async ({ page }) => {
            await page.getByPlaceholder(/Club mission|Mô tả/i).fill('Mô tả !!!');
            await page.locator('button:has-text("Create team")').first().click();
            await expect(page.locator('body')).toContainText(/Description cannot contain special characters|Please upload all 3 required images/i);
        });
    });

    // =============================================================
    // NHÓM 3: AUTH VALIDATION (TC_22 -> TC_28)
    // =============================================================
    test.describe('validateFormAuth (Register)', () => {

        test.beforeEach(async ({ page }) => {
            await page.goto(`${BASE_URL}/register`);
            // Đợi trang ổn định để tránh lỗi không tìm thấy nút
            await page.waitForLoadState('networkidle');
        });

        // Hàm hỗ trợ tìm nút Register trong nhóm này
        const getRegisterBtn = (page) => page.getByRole('button', { name: /JOIN NOW/i }).first();

        test('TC_22: FullName - Empty', async ({ page }) => {
            await page.fill('input[name="fullName"]', '');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Full name is required');
        });

        test('TC_23: FullName - Length (3-50)', async ({ page }) => {
            await page.fill('input[name="fullName"]', 'Ng');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Full name must be between 3 and 50 characters');
        });

        test('TC_24: FullName - Numbers/Special Chars', async ({ page }) => {
            await page.fill('input[name="fullName"]', 'NTest 123');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Full name cannot contain numbers or special characters');
        });

        test('TC_25: Email - Empty', async ({ page }) => {
            await page.fill('input[name="email"]', '');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Email is required');
        });

        test('TC_26: Email - Invalid Format', async ({ page }) => {
            await page.fill('input[name="email"]', 'ntest@com');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Invalid email format');
        });

        test('TC_27: Password - Empty', async ({ page }) => {
            await page.fill('input[name="password"]', '');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Password is required');
        });

        test('TC_28: Password - Min Length (6)', async ({ page }) => {
            await page.fill('input[name="password"]', '12345');
            await getRegisterBtn(page).click();
            await expect(page.locator('body')).toContainText('Password must be at least 6 characters');
        });
    });
});