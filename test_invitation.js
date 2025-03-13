const fetch = require('node-fetch');

// Replace with your actual organization ID
const organizationId = 'YOUR_ORGANIZATION_ID'; 

async function testInvitation() {
  try {
    const response = await fetch(`http://localhost:3000/api/debug/invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        role: 'USER',
        message: 'Testing invitation API with Node.js'
      })
    });

    const data = await response.json();
    console.log('Debug Endpoint Response:', JSON.stringify(data, null, 2));

    // Now let's test the actual invite endpoint
    console.log('\nTesting invitation endpoint:');
    console.log(`POST /api/organizations/${organizationId}/invite`);
    
    console.log('\nNote: This will likely fail without proper authentication.');
    console.log('Use the web-based debug tool at http://localhost:3000/debug/invitation-test instead.');
  } catch (error) {
    console.error('Error:', error);
  }
}

testInvitation(); 