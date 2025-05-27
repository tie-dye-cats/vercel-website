// Test script to verify Brevo + Supabase integration
// Run with: node test-brevo-integration.js

const testLead = {
  first_name: "John",
  email: "john.doe@example.com", 
  question: "I'm interested in your Facebook ad management services",
  phone: "+1234567890",
  source: "website_test"
}

async function testLeadSubmission() {
  try {
    console.log('🧪 Testing lead submission with dual storage...\n')
    
    const response = await fetch('http://localhost:3000/api/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testLead)
    })

    const result = await response.json()
    
    console.log('📊 API Response:')
    console.log(JSON.stringify(result, null, 2))
    
    if (result.success) {
      console.log('\n✅ SUCCESS: Lead saved to Supabase')
      console.log(`   Lead ID: ${result.leadId}`)
      
      if (result.brevo.success) {
        console.log('✅ SUCCESS: Contact created in Brevo')
        console.log(`   Contact ID: ${result.brevo.contactId}`)
      } else {
        console.log('⚠️  BREVO: Not configured (this is normal)')
        console.log(`   Reason: ${result.brevo.error}`)
        console.log('   💡 Add BREVO_API_KEY to .env to enable email marketing')
      }
    } else {
      console.log('❌ FAILED: Lead submission failed')
      console.log(`   Error: ${result.error}`)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Instructions
console.log('🚀 Brevo + Supabase Integration Test')
console.log('=====================================\n')
console.log('This test demonstrates the dual storage approach:')
console.log('1. Leads are ALWAYS saved to Supabase (your primary database)')
console.log('2. Leads are ALSO sent to Brevo (if API key is configured)')
console.log('3. Your lead capture never fails, even if Brevo is down\n')

console.log('📝 To enable Brevo integration:')
console.log('1. Sign up at https://app.brevo.com/')
console.log('2. Get your API key from Settings → API Keys')
console.log('3. Add BREVO_API_KEY=your_key_here to your .env file')
console.log('4. Add BREVO_LIST_ID=1 to your .env file')
console.log('5. Restart your server with npm run dev\n')

// Run the test
testLeadSubmission() 