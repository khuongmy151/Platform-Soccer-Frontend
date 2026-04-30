import { test, expect } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun';

test.describe('MY PROFILE ', () => {

    test.beforeEach(async ({ page }) => {
        test.setTimeout(60000);
        await page.goto(`${BASE_URL}/login`);
        await page.getByPlaceholder(/email/i).fill('minhngoc1907204@gmail.com');
        await page.getByPlaceholder(/password/i).fill('12345678');
        await page.getByRole('button', { name: 'Login', exact: true }).click();

        await page.waitForURL(url => !url.href.includes('/login'));
        await page.goto(`${BASE_URL}/my-profile`);
        await expect(page.getByText('FULL NAME')).toBeVisible({ timeout: 15000 });
    });

    test('TC_01: Kiểm tra hiển thị tiêu đề tên người dùng', async ({ page }) => {
        // Cách 1: Kiểm tra ô nhập tên có chứa giá trị (không rỗng)
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible();

        // Lấy giá trị hiện tại và kiểm tra xem nó có ít nhất 1 ký tự không
        const currentName = await nameInput.inputValue();
        expect(currentName.length).toBeGreaterThan(0);
    });

    test('TC_02: Kiểm tra hiển thị label FULL NAME và EMAIL ADDRESS', async ({ page }) => {
        await expect(page.locator('text=FULL NAME')).toBeVisible();
        await expect(page.locator('text=EMAIL ADDRESS')).toBeVisible();
    });

    test('TC_03: Kiểm tra hiển thị ô nhập tên và thực hiện nhập liệu', async ({ page }) => {
        const nameInput = page.locator('input[type="text"]').first();
        await expect(nameInput).toBeVisible();
        await nameInput.clear();
        await nameInput.fill('Minh Ngọc Test');
        await expect(nameInput).toHaveValue('Minh Ngọc Test');
    });

    test('TC_04: Kiểm tra hiển thị ô Email và xác nhận không thể sửa', async ({ page }) => {
        const emailInput = page.locator('input[type="email"]');
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveValue('minhngoc1907204@gmail.com');
        await expect(emailInput).toHaveAttribute('readonly', '');
    });

    test('TC_05: Kiểm tra hiển thị nút Change Password', async ({ page }) => {
        const changeBtn = page.getByRole('button', { name: /CHANGE PASSWORD/i });
        await expect(changeBtn).toBeVisible();
        console.log("Nút Change Password hiển thị bình thường, không thực hiện đổi pass.");
    });

    test('TC_06: Kiểm tra hiển thị nút SAVE CHANGES và Xử lý Dialog thành công', async ({ page }) => {
        // 1. Nhập số điện thoại đúng định dạng để tránh lỗi "Invalid phone number format"
        const phoneInput = page.locator('input[type="tel"], input[name*="phone"]').first();
        if (await phoneInput.isVisible()) {
            await phoneInput.clear();
            await phoneInput.fill('0901234567');
        }

        const saveBtn = page.getByRole('button', { name: 'SAVE CHANGES' });
        await expect(saveBtn).toBeVisible();

        // 2. Lắng nghe sự kiện bảng thông báo (Dialog)
        page.once('dialog', async dialog => {
            const message = dialog.message();
            console.log(`Thông báo từ hệ thống: ${message}`);

            expect(message).toContain('Lưu thông tin thành công!');
            await dialog.accept();
        });

        // 3. Nhấn nút Lưu
        await saveBtn.click();
    });

    test('TC_07: Kiểm tra hiển thị nút CANCEL và thực hiện thoát', async ({ page }) => {
        const cancelBtn = page.getByRole('button', { name: 'CANCEL' });
        await expect(cancelBtn).toBeVisible();
        await cancelBtn.click();
        await expect(page).not.toHaveURL(/.*my-profile/);
    });

    test('TC_08: Kiểm tra hiển thị Avatar và thực hiện click tương tác', async ({ page }) => {
        const avatar = page.locator('img.rounded-full, .rounded-full img').first();
        await expect(avatar).toBeVisible();
        await avatar.click();
        await expect(page.locator('input[type="file"]')).toBeAttached();
    });

    test('TC_09: Kiểm tra hiển thị nút LOGOUT và thực hiện đăng xuất', async ({ page }) => {
        const logoutBtn = page.getByText('LOGOUT');
        await expect(logoutBtn).toBeVisible();
        await logoutBtn.click();
        await expect(page).toHaveURL(/.*login/);
    });

    test('TC_10: Kiểm tra hiển thị nút DELETE ACCOUNT và màu sắc', async ({ page }) => {
        const deleteBtn = page.getByText(/DELETE ACCOUNT/i);
        await expect(deleteBtn).toBeVisible();
        await expect(deleteBtn).toHaveCSS('color', 'rgb(176, 37, 0)');
    });

    test('TC_11: Kiểm tra hiển thị Sidebar menu bên trái', async ({ page }) => {
        const sidebar = page.locator('aside, .sidebar').first();
        await expect(sidebar).toBeVisible();
    });

});