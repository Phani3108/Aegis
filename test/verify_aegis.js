const BASE_URL = 'http://localhost:3001/v1';

async function testInspect() {
    console.log('--- Testing /inspect ---');
    const response = await fetch(`${BASE_URL}/inspect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: 'Hello, my email is test@example.com and my phone number is 123-456-7890.',
            tenantId: 'tenant-1'
        })
    });
    const data = await response.json();
    console.log('Result:', JSON.stringify(data, null, 2));
}

async function testLlmProxy() {
    console.log('\n--- Testing /llm Proxy ---');
    const response = await fetch(`${BASE_URL}/llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: 'Please send an email to phani@aegis.ai with the report.'
        })
    });
    const data = await response.json();
    console.log('Result:', JSON.stringify(data, null, 2));
}

async function testToolFirewall() {
    console.log('\n--- Testing /tool Firewall (Allowed) ---');
    const response1 = await fetch(`${BASE_URL}/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            toolName: 'search',
            parameters: { query: 'weather in London' }
        })
    });
    console.log('Allowed Result:', await response1.json());

    console.log('\n--- Testing /tool Firewall (Blocked) ---');
    const response2 = await fetch(`${BASE_URL}/tool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            toolName: 'bank_transfer',
            parameters: { amount: 100 }
        })
    });
    console.log('Blocked Result:', await response2.json());
}

async function runTests() {
    try {
        await testInspect();
        await testLlmProxy();
        await testToolFirewall();
    } catch (err) {
        console.error('Test failed:', err);
    }
}

runTests();
