# ClickUp Integration Setup Guide

## Overview

This guide will help you integrate ClickUp task management with your lead capture system. When a new lead is submitted, the system will automatically create a task in ClickUp for follow-up and management.

## Integration Architecture

**Triple Storage System:**
1. **Supabase** (Primary) - Reliable lead storage
2. **Brevo** (Secondary) - Email marketing automation  
3. **ClickUp** (Tertiary) - Task management and follow-up

## Prerequisites

- ClickUp account (Free or paid)
- A ClickUp workspace and list where tasks will be created
- API access enabled in your ClickUp account

## Step 1: Get Your ClickUp API Key

1. **Login to ClickUp**
   - Go to [app.clickup.com](https://app.clickup.com)
   - Sign in to your account

2. **Access API Settings**
   - Click your profile picture in the bottom left
   - Select "Apps" from the menu
   - Click on "API" in the left sidebar

3. **Generate API Token**
   - Click "Generate" to create a new API token
   - Copy the token (starts with `pk_`)
   - **Important**: Save this token securely - you won't be able to see it again

## Step 2: Find Your List ID

1. **Navigate to Your List**
   - Go to the ClickUp list where you want tasks created
   - Look at the URL in your browser

2. **Extract List ID**
   - The URL will look like: `https://app.clickup.com/123456/v/li/987654321`
   - The List ID is the number after `/li/` (e.g., `987654321`)
   - Copy this number

## Step 3: Configure Environment Variables

Add these variables to your `.env` file:

```bash
# ClickUp Integration
CLICKUP_API_KEY=pk_your_api_key_here
CLICKUP_LIST_ID=your_list_id_here
```

### Example:
```bash
CLICKUP_API_KEY=pk_12345678_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCD
CLICKUP_LIST_ID=901234567
```

## Step 4: Test the Integration

1. **Run the test script:**
   ```bash
   node test-clickup-integration.js
   ```

2. **Expected output:**
   ```
   🧪 Testing ClickUp Integration...
   
   ✅ Environment variables configured
   📡 Testing ClickUp API connection...
   ✅ API connection successful
   📝 Creating test task...
   ✅ Test task created successfully
   🚀 Testing full lead submission with ClickUp...
   ✅ Lead submission successful
   ```

## Step 5: Verify Task Creation

1. **Check Your ClickUp List**
   - Go to your ClickUp list
   - Look for the test task created by the script
   - Verify the task contains lead information

2. **Task Structure**
   - **Name**: "New Lead: [First Name] - [Email]"
   - **Description**: Formatted lead details
   - **Tags**: Source, "lead", "new"
   - **Priority**: Normal (3)

## How It Works

### Lead Submission Flow
1. User submits lead form
2. **Supabase**: Lead saved to database (always succeeds)
3. **Brevo**: Contact added to email list (optional)
4. **ClickUp**: Task created for follow-up (optional)

### Task Details
Each lead creates a ClickUp task with:

```
**New Lead Submission**

**Contact Information:**
• Name: John Doe
• Email: john@example.com
• Phone: (555) 123-4567

**Lead Details:**
• Source: website
• Date: 12/27/2024
• Lead ID: 123

**Question/Message:**
I'm interested in your marketing services...

---
*This task was automatically created from a lead form submission.*
```

### Tags Applied
- Source name (e.g., "website", "facebook", "google")
- "lead" 
- "new"

## Customization Options

### Custom Fields (Optional)
If you have custom fields in ClickUp, you can map lead data:

```typescript
const customFields = {
  EMAIL_FIELD_ID: 'your-email-field-id',
  PHONE_FIELD_ID: 'your-phone-field-id',
  SOURCE_FIELD_ID: 'your-source-field-id',
  LEAD_DATE_FIELD_ID: 'your-date-field-id',
  LEAD_ID_FIELD_ID: 'your-lead-id-field-id'
}
```

### Task Priority
Default priority is 3 (Normal). You can modify in `lib/clickup.service.ts`:
- 1 = Urgent
- 2 = High  
- 3 = Normal
- 4 = Low

### Task Assignment
To auto-assign tasks, add assignee IDs to the task creation:

```typescript
assignees: [12345678] // ClickUp user ID
```

## Troubleshooting

### Common Issues

**❌ "Invalid API key"**
- Verify your API key is correct
- Ensure it starts with `pk_`
- Check for extra spaces in `.env` file

**❌ "List not found"**
- Verify the List ID is correct
- Ensure you have access to the list
- Check that the list exists in your workspace

**❌ "Permission denied"**
- Verify your API key has task creation permissions
- Check workspace access levels
- Ensure you're not using a guest account

**❌ "Task creation failed"**
- Check ClickUp service status
- Verify your workspace has available task limits
- Review API rate limits

### Debug Mode
Enable detailed logging by setting:
```bash
DEBUG=clickup:*
```

## API Rate Limits

ClickUp API limits:
- **Free Plan**: 100 requests per minute
- **Paid Plans**: 10,000 requests per hour

Our integration uses 1 request per lead submission.

## Security Best Practices

1. **Environment Variables**
   - Never commit API keys to version control
   - Use `.env` files for local development
   - Use secure environment variable storage in production

2. **API Key Management**
   - Rotate API keys periodically
   - Use separate keys for development/production
   - Monitor API key usage in ClickUp

3. **Error Handling**
   - ClickUp failures don't break lead submission
   - All errors are logged for debugging
   - Graceful degradation ensures system reliability

## Integration Benefits

### For Sales Teams
- **Automatic Task Creation**: Every lead becomes a trackable task
- **Centralized Management**: All leads in one ClickUp workspace
- **Follow-up Tracking**: Never miss a lead follow-up
- **Team Collaboration**: Assign and discuss leads

### For Marketing Teams
- **Lead Source Tracking**: See which channels generate tasks
- **Performance Metrics**: Track lead-to-task conversion
- **Campaign Integration**: Connect marketing efforts to tasks
- **ROI Analysis**: Measure campaign effectiveness

### For Management
- **Pipeline Visibility**: See all leads in ClickUp dashboards
- **Team Performance**: Track task completion rates
- **Process Optimization**: Identify bottlenecks
- **Reporting**: Generate lead management reports

## Next Steps

1. **Customize Task Templates**: Create standardized task formats
2. **Set Up Automations**: Use ClickUp automations for task routing
3. **Create Dashboards**: Build lead tracking dashboards
4. **Integrate Calendar**: Connect tasks to follow-up scheduling
5. **Set Up Notifications**: Configure team notifications for new leads

## Support

- **ClickUp API Documentation**: [clickup.com/api](https://clickup.com/api)
- **ClickUp Support**: [help.clickup.com](https://help.clickup.com)
- **Integration Issues**: Check the console logs for detailed error messages 