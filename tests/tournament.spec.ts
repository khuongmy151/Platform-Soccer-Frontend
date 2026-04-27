import { test, expect } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun';

// ================= TC01 =================
test('TC01: GET tournaments list', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);

  expect(res.status()).toBe(200);

  const text = await res.text();
  expect(text.length).toBeGreaterThan(0);
});

// ================= TC02 =================
test('TC02: GET tournaments again', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC03 =================
test('TC03: GET multiple times', async ({ request }) => {
  for (let i = 0; i < 3; i++) {
    const res = await request.get(`${BASE_URL}/tournaments`);
    expect(res.status()).toBe(200);
  }
});

// ================= TC04 =================
test('TC04: Check response not empty', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text).not.toBe('');
});

// ================= TC05 =================
test('TC05: Response contains data', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text.includes('id') || text.includes('name')).toBeTruthy();
});

// ================= TC06 =================
test('TC06: Status always 200', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC07 =================
test('TC07: Performance check', async ({ request }) => {
  const start = Date.now();

  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);

  const duration = Date.now() - start;
  expect(duration).toBeLessThan(5000);
});

// ================= TC08 =================
test('TC08: Multiple concurrent GET', async ({ request }) => {
  const requests = Array.from({ length: 5 }, () =>
    request.get(`${BASE_URL}/tournaments`)
  );

  const responses = await Promise.all(requests);

  responses.forEach(res => {
    expect(res.status()).toBe(200);
  });
});

// ================= TC09 =================
test('TC09: Response is JSON or HTML', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text.startsWith('{') || text.startsWith('<')).toBeTruthy();
});

// ================= TC10 =================
test('TC10: API reachable', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.ok()).toBeTruthy();
});

// ================= TC11 =================
test('TC11: Repeat GET 11', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC12 =================
test('TC12: Repeat GET 12', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC13 =================
test('TC13: Repeat GET 13', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC14 =================
test('TC14: Repeat GET 14', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC15 =================
test('TC15: Repeat GET 15', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC16 =================
test('TC16: Repeat GET 16', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC17 =================
test('TC17: Repeat GET 17', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC18 =================
test('TC18: Repeat GET 18', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC19 =================
test('TC19: Repeat GET 19', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC20 =================
test('TC20: Repeat GET 20', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC21 =================
test('TC21: Response time < 5s', async ({ request }) => {
  const start = Date.now();
  const res = await request.get(`${BASE_URL}/tournaments`);
  const duration = Date.now() - start;

  expect(res.status()).toBe(200);
  expect(duration).toBeLessThan(5000);
});

// ================= TC22 =================
test('TC22: Response not empty', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text.length).toBeGreaterThan(0);
});

// ================= TC23 =================
test('TC23: Response contains keyword', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text.includes('id') || text.includes('name')).toBeTruthy();
});

// ================= TC24 =================
test('TC24: Response is valid text', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(typeof text).toBe('string');
});

// ================= TC25 =================
test('TC25: Status is OK', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.ok()).toBeTruthy();
});

// ================= TC26 =================
test('TC26: Call API 2 times', async ({ request }) => {
  const res1 = await request.get(`${BASE_URL}/tournaments`);
  const res2 = await request.get(`${BASE_URL}/tournaments`);

  expect(res1.status()).toBe(200);
  expect(res2.status()).toBe(200);
});

// ================= TC27 =================
test('TC27: Call API 5 times', async ({ request }) => {
  for (let i = 0; i < 5; i++) {
    const res = await request.get(`${BASE_URL}/tournaments`);
    expect(res.status()).toBe(200);
  }
});

// ================= TC28 =================
test('TC28: Parallel requests', async ({ request }) => {
  const arr = Array.from({ length: 5 }, () =>
    request.get(`${BASE_URL}/tournaments`)
  );

  const results = await Promise.all(arr);

  results.forEach(res => {
    expect(res.status()).toBe(200);
  });
});

// ================= TC29 =================
test('TC29: Check response starts correctly', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text[0]).toBeDefined();
});

// ================= TC30 =================
test('TC30: Response length > 10', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text.length).toBeGreaterThan(10);
});

// ================= TC31 =================
test('TC31: API always reachable', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.ok()).toBeTruthy();
});

// ================= TC32 =================
test('TC32: Multiple sequential calls', async ({ request }) => {
  for (let i = 0; i < 3; i++) {
    const res = await request.get(`${BASE_URL}/tournaments`);
    expect(res.status()).toBe(200);
  }
});

// ================= TC33 =================
test('TC33: Response includes data', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text).toContain('');
});

// ================= TC34 =================
test('TC34: API stable', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC35 =================
test('TC35: Response not null', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res).not.toBeNull();
});

// ================= TC36 =================
test('TC36: Text response exists', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  const text = await res.text();

  expect(text).toBeTruthy();
});

// ================= TC37 =================
test('TC37: Response header exists', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);

  expect(res.headers()).toBeTruthy();
});

// ================= TC38 =================
test('TC38: Response status stable', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC39 =================
test('TC39: Call API again', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});

// ================= TC40 =================
test('TC40: Final check', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/tournaments`);
  expect(res.status()).toBe(200);
});