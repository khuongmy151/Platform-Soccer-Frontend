# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


Platform-Soccer-Frontend

HƯỚNG DẪN TEST FRONTEND BẰNG PLAYWRIGHT
Mục tiêu hướng dẫn
•	Chạy project Frontend trên máy local.
•	Chạy test tự động bằng Playwright.
•	Chạy test Umami bằng Plawright.
•	Xem báo cáo kết quả test.
•	Kiểm tra lỗi trước khi push code.
•	Đảm bảo tính ổn định của giao diện và chức năng.

TRƯỜNG HỢP CHƯA CÓ PROJECT
1. Clone project
   Mở terminal (Git Bash / CMD), gõ:
   •	git clone https://github.com/DPSgion/Platform-Soccer-Frontend.git
2. Vào thư mục project
   •	cd Platform-Soccer-Frontend

TRƯỜNG HỢP ĐÃ CÓ PROJECT
1. Lấy code nhánh Tester
   •	Gõ: git branch -a
    Tìm nhánh: remotes/origin/feat/tester
   •	Tạo và chuyển sang nhánh:
   Gõ: git checkout -b feat/tester origin/feat/tester
   •	Kiểm tra file: dir

2. Cài đặt thư viện
   •	Cài đặt dependencies
   o	npm install
   •	Cài Playwright (nếu chưa có)
   o	npx playwright install
   o	npm install --save-dev jest @types/jest ts-jest typescript
   o	npm install --save-dev @playwright/test
   o	yarn
3. Chạy project Frontend
   npm run dev
   Khi chạy thành công, terminal sẽ hiển thị địa chỉ, ví dụ:
   Local: http://localhost:5173

4. Chạy test tự động bằng Playwright
   •	Chạy một file test trên 1 trình duyệt nhất định
   o	Ví dụ:
   o	npx playwright test dashboardPublic.spec.ts --project=chromium
   •	Chạy toàn bộ test
   o	npx playwright test
   •	Xem kết quả test
   o	npx playwright show-report

5. Chạy test trên giao diện (UI Mode)
   npx playwright test --ui
   Chức năng của UI Mode:
   •	Xem quá trình chạy test trực tiếp.
   •	Debug từng bước.

Quy trình
•	Chạy Frontend trên local.
•	Chạy Playwright test.
•	Fix lỗi nếu test fail.
•	Kiểm tra lại kết quả test.
•	Push code.

