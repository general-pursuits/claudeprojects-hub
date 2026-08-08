# The Opportunity Designed — Inquiry Workflow Setup Guide

Everything you need to connect your website contact form to Google Sheets tracking and email notifications. Takes about 15 minutes.

---

## What you're setting up

When someone fills out the contact form on your website:

1. Their inquiry gets logged to a Google Sheet (your tracker)
2. You get a branded email notification with their details
3. You can reply directly from the email, or click into the tracker for status management

**You'll need:** A Google account (your `adelitamorrow@gmail.com` works fine).

---

## Step 1: Create the Google Sheet

1. Open Google Sheets ([sheets.google.com](https://sheets.google.com))
2. Upload the file `opportunity-designed-inquiry-tracker.xlsx` — click the folder icon or go to **File > Import** and select the `.xlsx` file
3. Once it opens, look at the URL in your browser. It looks like:
   ```
   https://docs.google.com/spreadsheets/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit
   ```
4. Copy the long string between `/d/` and `/edit` — that's your **Spreadsheet ID**
   (in the example above, it would be `1aBcDeFgHiJkLmNoPqRsTuVwXyZ`)
5. Save this ID — you'll need it in the next step

**Check:** You should see two tabs at the bottom: "Inquiry Tracker" and "Dashboard."

---

## Step 2: Set up Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click **New project** (top left)
3. You'll see a file called `Code.gs` with a blank function — select all the placeholder text and delete it
4. Open the file `opportunity-designed-apps-script.js` on your computer, copy the entire contents, and paste it into the editor
5. Find this line near the top:
   ```
   SPREADSHEET_ID: "YOUR_SPREADSHEET_ID_HERE",
   ```
6. Replace `YOUR_SPREADSHEET_ID_HERE` with the Spreadsheet ID you copied in Step 1 (keep the quotes)
7. Click the floppy disk icon (or Cmd+S) to save
8. Rename the project: click "Untitled project" at the top and type **Opportunity Designed Inquiries**

---

## Step 3: Test it

Before deploying, make sure everything is wired up:

1. In the Apps Script editor, click the function dropdown (says `doPost`) and change it to `testSubmission`
2. Click the **Run** button (play icon)
3. The first time, Google will ask you to authorize the script:
   - Click **Review permissions**
   - Select your Google account
   - You may see "Google hasn't verified this app" — click **Advanced** then **Go to Opportunity Designed Inquiries (unsafe)**
   - Click **Allow**
4. After it runs, check two things:
   - **Your Google Sheet:** A test row should appear in the Inquiry Tracker tab
   - **Your email:** You should receive a branded notification email with "Test Person" details

**If both work, you're good.** Delete the test row from the sheet if you want a clean start.

---

## Step 4: Deploy the Apps Script as a web app

This makes the script accessible from your website's contact form.

1. In the Apps Script editor, click **Deploy** (top right) then **New deployment**
2. Click the gear icon next to "Select type" and choose **Web app**
3. Fill in:
   - **Description:** `Inquiry form handler`
   - **Execute as:** `Me` (your email)
   - **Who has access:** `Anyone`
4. Click **Deploy**
5. You'll see a **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```
6. **Copy this URL** — this is what your website form will POST to

**Important:** "Anyone" means anyone with the URL can submit the form (which is what you want — your website visitors need to reach it). It does not give anyone access to your sheet or email.

---

## Step 5: Connect your website

1. Open `the-opportunity-designed-website.html` in a text editor
2. Find this line near the bottom of the file (in the `<script>` section):
   ```
   const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";
   ```
3. Replace `YOUR_APPS_SCRIPT_URL_HERE` with the web app URL from Step 4 (keep the quotes)
4. Save the file
5. Re-upload to your hosting provider (Netlify, GitHub Pages, etc.)

---

## Step 6: Test the live form

1. Open your website and fill out the contact form with test info
2. Verify:
   - The form shows a "Thank you" confirmation message
   - A new row appears in your Google Sheet
   - You receive an email notification
   - Clicking "Reply directly" in the email opens a compose window addressed to the test email
   - Clicking "Open in tracker" takes you to the right row in your sheet

---

## How to use the tracker day-to-day

**When a new inquiry comes in:**
- You get an email immediately
- Quick reply? Hit "Reply directly" in the email — it goes straight to them
- Need to think about it? Click "Open in tracker" to update the status

**In the Google Sheet:**
- **Status column:** Click the cell and select from the dropdown (New, Contacted, In Conversation, Proposal Sent, Won, Lost, On Hold)
- **Priority column:** Set High, Medium, or Low
- **Follow-Up Date:** Set a date to remind yourself
- **Response Notes:** Jot notes about the conversation
- **Next Action:** What's the next step?
- **Revenue Potential:** Estimate the deal size once you know more

**Dashboard tab:** Shows pipeline summary, win rate, and which inquiries need follow-up. Updates automatically as you update the tracker.

---

## If you need to update the Apps Script later

If you ever change the script code:

1. Go to [script.google.com](https://script.google.com) and open your project
2. Make your changes and save
3. Click **Deploy > Manage deployments**
4. Click the pencil/edit icon on your deployment
5. Change **Version** to **New version**
6. Click **Deploy**

The URL stays the same — you don't need to update your website.

---

## Quick reference

| What | Where |
|------|-------|
| Inquiry tracker | Your Google Sheet (bookmark it) |
| Apps Script | [script.google.com](https://script.google.com) |
| Website file | `the-opportunity-designed-website.html` |
| Email notifications | Your Gmail inbox |
| Script configuration | Top of `Code.gs` in Apps Script |

---

## Troubleshooting

**Form submits but nothing happens in the sheet:**
- Check that the Spreadsheet ID in Apps Script matches your sheet URL
- Make sure the sheet tab is named exactly "Inquiry Tracker" (case-sensitive)
- Re-run `testSubmission` in Apps Script to check for errors (View > Execution log)

**No email notification:**
- Check your spam folder
- Run `testSubmission` again — if the sheet row appears but no email, check the Execution log for email quota errors

**Form shows an error message:**
- Make sure the Apps Script URL in your website file is correct
- Check that the deployment is set to "Anyone" for access

**Need to re-authorize:**
- If Google revokes permissions, open Apps Script and run any function — it will prompt you to re-authorize
