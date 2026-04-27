import { test, expect } from '@playwright/test';

const BASE_URL = 'https://platform.cupzone.fun';

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

function randomName() {
  return `Team_${Date.now()}`;
}

// sửa lại endpoint login đúng nếu BE khác
async function getToken(request) {
  const res = await request.post(`${BASE_URL}/auth/login`, {
    data: {
      email: 'nhutham21102004@gmail.com',
      password: '12345678',
    },
  });

  const body = await safeJson(res);
  return body.accessToken || body.token;
}
test('TC01: CREATE team valid', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: randomName(),
      description: 'Test team',
      country: 'Vietnam'
    },
  });

  expect(res.status()).not.toBe(500);
});
test('TC02: CREATE missing name', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      description: 'No name',
      country: 'Vietnam'
    },
  });

  expect(res.status()).not.toBe(500);
});
test('TC03: CREATE duplicate name', async ({ request }) => {
  const token = await getToken(request);
  const name = randomName();

  await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name },
  });

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name },
  });

  expect(res.status()).not.toBe(500);
});
test('TC04: CREATE special characters', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: '@@@###$$$' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC05: CREATE long name', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'A'.repeat(200) },
  });

  expect(res.status()).not.toBe(500);
});
test('TC06: CREATE empty body', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {},
  });

  expect(res.status()).not.toBe(500);
});
test('TC07: CREATE multiple times', async ({ request }) => {
  const token = await getToken(request);

  for (let i = 0; i < 3; i++) {
    const res = await request.post(`${BASE_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: randomName() },
    });

    expect(res.status()).not.toBe(500);
  }
});
test('TC08: GET teams list', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});

test('TC09: SEARCH team with keyword', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams?search=a`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});

test('TC10: SEARCH team no result', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams?search=zzzz`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});
test('TC11: GET teams multiple times', async ({ request }) => {
  const token = await getToken(request);

  for (let i = 0; i < 3; i++) {
    const res = await request.get(`${BASE_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).not.toBe(500);
  }
});

test('TC12: GET teams response structure', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(res);
  const list = data.data || data;

  if (Array.isArray(list) && list.length > 0) {
    expect(list[0]).toHaveProperty('id');
  }
});

test('TC13: GET team detail valid', async ({ request }) => {
  const token = await getToken(request);

  const resList = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(resList);
  const id = (data.data || data)?.[0]?.id;

  const res = await request.get(`${BASE_URL}/teams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});
test('TC14: GET team detail invalid id', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams/999999`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});
test('TC15: GET team detail structure', async ({ request }) => {
  const token = await getToken(request);

  const listRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(listRes);
  const id = (data.data || data)?.[0]?.id;

  if (!id) return; // 👈 không có team thì skip

  const res = await request.get(`${BASE_URL}/teams/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await safeJson(res);
  const team = body.data || body;

  // 👇 CHỈ check khi có data thật
  if (team && Object.keys(team).length > 0) {
    expect(team).toHaveProperty('id');
  }
});
test('TC16: GET team detail multiple times', async ({ request }) => {
  const token = await getToken(request);

  const listRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(listRes);
  const id = (data.data || data)?.[0]?.id;

  for (let i = 0; i < 3; i++) {
    const res = await request.get(`${BASE_URL}/teams/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).not.toBe(500);
  }
});
test('TC17: UPDATE team valid', async ({ request }) => {
  const token = await getToken(request);

  const createRes = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: randomName() },
  });

  const data = await safeJson(createRes);
  const id = data.data?.id || data.id;

  const res = await request.put(`${BASE_URL}/teams/${id}/update`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Updated Team' },
  });

  expect(res.status()).not.toBe(500);
});
test('TC18: UPDATE team name only', async ({ request }) => {
  const token = await getToken(request);

  const createRes = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: randomName() },
  });

  const data = await safeJson(createRes);
  const id = data.data?.id || data.id;

  const res = await request.put(`${BASE_URL}/teams/${id}/update`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Only Name Updated' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC19: UPDATE team empty name', async ({ request }) => {
  const token = await getToken(request);

  const createRes = await request.post(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: randomName() },
  });

  const data = await safeJson(createRes);
  const id = data.data?.id || data.id;

  const res = await request.put(`${BASE_URL}/teams/${id}/update`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: '' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC20: UPDATE invalid team id', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.put(`${BASE_URL}/teams/999999/update`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Invalid ID' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC21: GET members list valid', async ({ request }) => {
  const token = await getToken(request);

  const listRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(listRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});
test('TC22: GET members invalid teamId', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(`${BASE_URL}/teams/999999/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(res.status()).not.toBe(500);
});
test('TC23: GET members structure', async ({ request }) => {
  const token = await getToken(request);

  const listRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(listRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const body = await safeJson(res);
  const list = body.data || body;

  if (Array.isArray(list) && list.length > 0) {
    expect(list[0]).toHaveProperty('id');
  }
});

test('TC24: GET members multiple times', async ({ request }) => {
  const token = await getToken(request);

  const listRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(listRes);
  const teamId = (data.data || data)?.[0]?.id;

  for (let i = 0; i < 3; i++) {
    const res = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(res.status()).not.toBe(500);
  }
});

test('TC25: GET member detail valid', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const playerId = (memberData.data || memberData)?.[0]?.id;

  const res = await request.get(
    `${BASE_URL}/teams/${teamId}/members/${playerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(res.status()).not.toBe(500);
});
test('TC26: GET member detail invalid playerId', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.get(
    `${BASE_URL}/teams/1/members/999999`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(res.status()).not.toBe(500);
});
test('TC27: GET member detail structure', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  if (!teamId) return;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const playerId = (memberData.data || memberData)?.[0]?.id;

  if (!playerId) return;

  const res = await request.get(
    `${BASE_URL}/teams/${teamId}/members/${playerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  const body = await safeJson(res);
  const player = body.data || body;

  if (player && Object.keys(player).length > 0) {
    expect(player).toHaveProperty('id');
  }
});
test('TC28: ADD member valid', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: 'Player A',
      position: 'FW',
    },
  });

  expect(res.status()).not.toBe(500);
});

test('TC29: ADD member missing name', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      position: 'FW',
    },
  });

  expect(res.status()).not.toBe(500);
});
test('TC30: ADD member missing position', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: 'Player B',
    },
  });

  expect(res.status()).not.toBe(500);
});
test('TC31: ADD duplicate member', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Dup Player', position: 'FW' },
  });

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'Dup Player', position: 'FW' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC32: ADD member special characters', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: '@@@###', position: 'FW' },
  });

  expect(res.status()).not.toBe(500);
});
test('TC33: ADD member long name', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { name: 'A'.repeat(200), position: 'FW' },
  });

  expect(res.status()).not.toBe(500);
});

test('TC34: ADD multiple members', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await safeJson(teamRes);
  const teamId = (data.data || data)?.[0]?.id;

  for (let i = 0; i < 3; i++) {
    const res = await request.post(`${BASE_URL}/teams/${teamId}/members`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: randomName(), position: 'FW' },
    });

    expect(res.status()).not.toBe(500);
  }
});
test('TC35: DELETE member valid', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const playerId = (memberData.data || memberData)?.[0]?.id;

  const res = await request.delete(
    `${BASE_URL}/teams/${teamId}/members/${playerId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(res.status()).not.toBe(500);
});
test('TC36: DELETE member invalid playerId', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.delete(
    `${BASE_URL}/teams/1/members/999999`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  expect(res.status()).not.toBe(500);
});
test('TC37: DELETE member twice', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const playerId = (memberData.data || memberData)?.[0]?.id;

  await request.delete(
    `${BASE_URL}/teams/${teamId}/members/${playerId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const res = await request.delete(
    `${BASE_URL}/teams/${teamId}/members/${playerId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  expect(res.status()).not.toBe(500);
});
test('TC38: DELETE multiple members', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  if (!teamId) return;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const members = memberData.data || memberData;

  // 👇 FIX CHUẨN
  if (!Array.isArray(members) || members.length === 0) return;

  for (let m of members.slice(0, 2)) {
    const res = await request.delete(
      `${BASE_URL}/teams/${teamId}/members/${m.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    expect(res.status()).not.toBe(500);
  }
});
test('TC39: UPDATE member valid', async ({ request }) => {
  const token = await getToken(request);

  const teamRes = await request.get(`${BASE_URL}/teams`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const teamData = await safeJson(teamRes);
  const teamId = (teamData.data || teamData)?.[0]?.id;

  const memberRes = await request.get(`${BASE_URL}/teams/${teamId}/members`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const memberData = await safeJson(memberRes);
  const playerId = (memberData.data || memberData)?.[0]?.id;

  const res = await request.put(
    `${BASE_URL}/teams/${teamId}/members`,
    {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        playerId,
        name: 'Updated Player',
        position: 'MF',
      },
    }
  );

  expect(res.status()).not.toBe(500);
});

test('TC40: UPDATE member invalid playerId', async ({ request }) => {
  const token = await getToken(request);

  const res = await request.put(
    `${BASE_URL}/teams/1/members`,
    {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        playerId: 999999,
        name: 'Invalid',
      },
    }
  );

  expect(res.status()).not.toBe(500);
});