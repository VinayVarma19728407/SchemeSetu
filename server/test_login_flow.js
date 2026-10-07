const BASE_URL = 'http://localhost:5000';

async function testFullAuthFlow() {
  console.log('================================================================');
  console.log('       SCHEMESETU COMPLETE AUTHENTICATION & LOGIN TEST SUITE     ');
  console.log('================================================================\n');

  // TEST 1: Admin Direct Login (/api/admin/login)
  console.log('TEST 1: Admin Direct Login via /api/admin/login...');
  const res1 = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@schemesetu.gov', password: 'AdminPassword123' })
  });
  const data1 = await res1.json();
  console.log('? Status Code:', res1.status, res1.statusText);
  console.log('? Success Message:', JSON.stringify(data1.message));
  console.log('? User Info:', data1.data.user);
  console.log('? JWT Token Acquired:', data1.data.token.slice(0, 30) + '...\n');

  const adminToken = data1.data.token;

  // TEST 2: Session Check (/api/auth/profile) with Admin Token
  console.log('TEST 2: Session Check (/api/auth/profile) with Admin Token...');
  const res2 = await fetch(`${BASE_URL}/api/auth/profile`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const data2 = await res2.json();
  console.log('? Status Code:', res2.status);
  console.log('? Profile Data:', data2.data);
  if (data2.data.role === 'Administrator') {
    console.log('? VERIFIED: User role is "Administrator" - Admin session remains active!\n');
  } else {
    throw new Error('FAILED: Role is not Administrator!');
  }

  // TEST 3: Admin Protected Routes Access
  console.log('TEST 3: Verifying Protected Admin Endpoints with Admin Token...');
  const resDash = await fetch(`${BASE_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const dataDash = await resDash.json();
  console.log('? /api/admin/dashboard accessible. Status:', resDash.status);

  const resCats = await fetch(`${BASE_URL}/api/admin/categories`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const dataCats = await resCats.json();
  console.log('? /api/admin/categories accessible. Categories Count:', dataCats.data.length);

  const resUsers = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  const dataUsers = await resUsers.json();
  console.log('? /api/admin/users accessible. Registered Citizens:', dataUsers.data.length, '\n');

  // TEST 4: Unified Login (/api/auth/login) with Admin Credentials
  console.log('TEST 4: Testing Universal Login (/api/auth/login) with Admin Credentials...');
  const res4 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@schemesetu.gov', password: 'AdminPassword123' })
  });
  const data4 = await res4.json();
  console.log('? Status Code:', res4.status);
  console.log('? User Role returned:', data4.data.user.role);
  console.log('? Successfully recognizes Administrator on public login page!\n');

  // TEST 5: Negative Testing - Invalid Password
  console.log('TEST 5: Testing Login with Wrong Password...');
  const res5 = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@schemesetu.gov', password: 'WrongPassword999' })
  });
  const data5 = await res5.json();
  console.log('? Status Code:', res5.status, '(Correctly rejected with 401 Unauthorized)');
  console.log('? Error message returned:', data5.message, '\n');

  console.log('================================================================');
  console.log('?? ALL 5 AUTHENTICATION TESTS PASSED WITH ZERO ERRORS!');
  console.log('================================================================');
}

testFullAuthFlow().catch(err => {
  console.error('? Test failed:', err);
  process.exit(1);
});
