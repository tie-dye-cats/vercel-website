# Brevo Integration Setup

## Overview
Your lead capture form is now integrated with Brevo (formerly Sendinblue) for automated email marketing and lead nurturing.

## Required Environment Variables

Add these to your `.env` file:

```env
# Brevo API Configuration
BREVO_API_KEY=your_brevo_api_key_here
BREVO_LIST_ID=1
```

## Setup Steps

### 1. Get Your Brevo API Key
1. Log in to your [Brevo account](https://app.brevo.com/)
2. Go to **Settings** → **API Keys**
3. Click **Generate a new API key**
4. Copy the API key and add it to your `.env` file

### 2. Create a Contact List
1. In Brevo, go to **Contacts** → **Lists**
2. Click **Create a list**
3. Name it something like "Website Leads" or "AdVelocity Prospects"
4. Note the List ID (visible in the URL or list settings)
5. Update `BREVO_LIST_ID` in your `.env` file

### 3. Set Up Contact Attributes (Optional)
To store additional lead data, create these custom attributes in Brevo:
- `FIRSTNAME` (Text)
- `LASTNAME` (Text) 
- `SMS` (Text) - for phone numbers
- `QUESTION` (Text) - for lead questions
- `SOURCE` (Text) - lead source tracking
- `LEAD_DATE` (Date) - when lead was captured

### 4. Create Email Campaigns (Optional)
Set up automated email sequences:
1. **Welcome Email** - immediate response
2. **Follow-up Series** - nurture sequence
3. **Consultation Booking** - CTA for meetings

## What Happens When a Lead Submits

1. **Lead saved to Supabase** - your primary database (always happens)
2. **Contact created in Brevo** - added to your email list (if API key configured)
3. **Attributes populated** - all form data stored in both systems
4. **Automation triggered** - any email sequences you've set up in Brevo

**Important**: Lead capture will always work even if Brevo is not configured. Supabase is the primary storage, and Brevo is an additional enhancement for email marketing.

## Testing the Integration

1. Submit a test lead through your form
2. Check the browser console for Brevo success/error messages
3. Verify the contact appears in your Brevo list
4. Test any automated email campaigns

## Troubleshooting

### Common Issues:
- **API Key Invalid**: Double-check the key in Brevo settings
- **List ID Wrong**: Verify the list ID in Brevo dashboard
- **Attributes Missing**: Create custom attributes in Brevo
- **Rate Limits**: Brevo has API rate limits for free accounts

### Error Handling:
- If Brevo fails, the lead is still saved to Supabase
- Check server logs for detailed error messages
- Brevo errors won't break your lead capture process

## Dual Storage Architecture

Your lead capture system uses a **dual storage approach**:

### Primary Storage: Supabase
- ✅ **Always reliable** - leads are never lost
- ✅ **Full control** - your own database
- ✅ **Real-time access** - immediate availability
- ✅ **Custom queries** - flexible data analysis

### Secondary Storage: Brevo
- ✅ **Email marketing** - automated campaigns
- ✅ **Segmentation** - organize by behavior
- ✅ **Analytics** - email performance tracking
- ✅ **Templates** - professional email designs

## Benefits of This Integration

✅ **Automated Lead Nurturing** - immediate email responses
✅ **Segmented Lists** - organize leads by source/type  
✅ **Email Campaigns** - automated follow-up sequences
✅ **Analytics** - track email open rates and clicks
✅ **CRM Integration** - sync with other tools
✅ **Redundant Storage** - leads saved in both systems
✅ **Graceful Degradation** - works even if Brevo is down

## Phone Number Handling

**Status**: ✅ Phone numbers are successfully integrated with Brevo using E.164 format.

### How It Works
- **User Input**: Users can enter phone numbers in any common format
- **Display**: Numbers are formatted nicely in the UI (e.g., "(479) 431-9332")
- **Storage**: Supabase stores the original user-entered format
- **Brevo Integration**: Numbers are automatically converted to E.164 format

### Supported Input Formats
All these formats are automatically converted to `+14794319332` for Brevo:
- `479-431-9332` ✅ 
- `(479) 431-9332` ✅ 
- `479 431 9332` ✅ 
- `4794319332` ✅ 
- `+14794319332` ✅ 

### E.164 Format Requirements
- Must start with `+` followed by country code
- US numbers: `+1` followed by 10 digits  
- No spaces, dashes, or parentheses
- International standard for phone numbers

### Benefits
- **User-Friendly**: Users can enter numbers however they prefer
- **API-Compliant**: Brevo receives properly formatted numbers
- **Dual Storage**: Original format in Supabase, E.164 in Brevo
- **SMS Ready**: E.164 format enables SMS campaigns in Brevo

## Next Steps

1. Set up your first automated email campaign
2. Create email templates for different lead types
3. Configure lead scoring based on engagement
4. Set up SMS campaigns (if using Brevo SMS features)
5. Integrate with your calendar for booking meetings 