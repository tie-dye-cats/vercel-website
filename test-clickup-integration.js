const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test ClickUp API connection and task creation
async function testClickUpIntegration() {
  console.log('🧪 Testing ClickUp Integration...\n');
  
  // These will need to be set in environment variables
  const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
  const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;
  
  if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
    console.log('❌ ClickUp environment variables not set:');
    console.log('- CLICKUP_API_KEY:', !!CLICKUP_API_KEY);
    console.log('- CLICKUP_LIST_ID:', !!CLICKUP_LIST_ID);
    console.log('\nPlease set these environment variables to test ClickUp integration.');
    return;
  }
  
  console.log('✅ Environment variables configured');
  console.log('- API Key length:', CLICKUP_API_KEY.length);
  console.log('- List ID:', CLICKUP_LIST_ID);
  console.log();
  
  // Test 1: Check API connection
  console.log('📡 Testing ClickUp API connection...');
  try {
    const userResponse = await fetch('https://api.clickup.com/api/v2/user', {
      method: 'GET',
      headers: {
        'Authorization': CLICKUP_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const userData = await userResponse.json();
    
    if (userResponse.ok) {
      console.log('✅ API connection successful');
      console.log(`   User: ${userData.user.username} (${userData.user.email})`);
    } else {
      console.log('❌ API connection failed:', userData);
      return;
    }
  } catch (error) {
    console.log('❌ API connection error:', error.message);
    return;
  }
  
  // Test 2: Create a test task
  console.log('\n📝 Creating test task...');
  try {
    const taskData = {
      name: 'Test Lead: John Doe - john@example.com',
      description: `**New Lead Submission**

**Contact Information:**
• Name: John Doe
• Email: john@example.com
• Phone: (555) 123-4567

**Lead Details:**
• Source: test
• Date: ${new Date().toLocaleDateString()}
• Lead ID: 999

**Question/Message:**
This is a test lead submission to verify ClickUp integration is working properly.

---
*This task was automatically created from a lead form submission.*`,
      tags: ['test', 'lead', 'new'],
      priority: 3,
      notify_all: false
    };
    
    const taskResponse = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
      method: 'POST',
      headers: {
        'Authorization': CLICKUP_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskData)
    });
    
    const taskResult = await taskResponse.json();
    
    if (taskResponse.ok) {
      console.log('✅ Test task created successfully');
      console.log(`   Task ID: ${taskResult.id}`);
      console.log(`   Task URL: ${taskResult.url}`);
      console.log(`   Status: ${taskResult.status.status}`);
    } else {
      console.log('❌ Task creation failed:', taskResult);
      return;
    }
  } catch (error) {
    console.log('❌ Task creation error:', error.message);
    return;
  }
  
  // Test 3: Test our API endpoint with ClickUp integration
  console.log('\n🚀 Testing full lead submission with ClickUp...');
  try {
    const leadData = {
      first_name: 'ClickUp',
      email: 'clickup.test@example.com',
      phone: '479-431-9332',
      question: 'Testing ClickUp integration with lead form',
      source: 'clickup_test'
    };
    
    const leadResponse = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });
    
    const leadResult = await leadResponse.json();
    
    if (leadResponse.ok) {
      console.log('✅ Lead submission successful');
      console.log(`   Lead ID: ${leadResult.leadId}`);
      console.log(`   Brevo: ${leadResult.brevo?.success ? '✅' : '❌'} ${leadResult.brevo?.contactId || leadResult.brevo?.error || ''}`);
      console.log(`   ClickUp: ${leadResult.clickup?.success ? '✅' : '❌'} ${leadResult.clickup?.taskId || leadResult.clickup?.error || ''}`);
      
      if (leadResult.clickup?.taskUrl) {
        console.log(`   Task URL: ${leadResult.clickup.taskUrl}`);
      }
    } else {
      console.log('❌ Lead submission failed:', leadResult);
    }
  } catch (error) {
    console.log('❌ Lead submission error:', error.message);
  }
  
  console.log('\n🎉 ClickUp integration test complete!');
}

// Run the test
testClickUpIntegration().catch(console.error); 