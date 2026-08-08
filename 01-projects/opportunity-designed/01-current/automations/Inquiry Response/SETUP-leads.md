# Lead tracking + confirmation emails — setup guide

Everything here is **free** and uses your existing Google account.

**How the flow works:** the site has no direct booking. Every visitor goes through the
contact form. Each submission is logged to a Google Sheet, emails you a notification, and
auto-sends the person a confirmation. You personally review each lead and reach out to
schedule a consultation when it's a fit.

```
Visitor fills the contact form  ─▶  Apps Script  ─▶  row in your Google Sheet
                                                  ├─▶  notification email to you
                                                  └─▶  confirmation email to them
You review the lead  ─▶  reach out personally to schedule a consultation (when it's a fit)
```

When you've finished the steps below, send me the **Apps Script `/exec` URL** and I'll drop it
into the site (or follow the "connect it to the site" note yourself).

---

## Setup

1. **Create the Google Sheet.** Go to sheets.new, name it "Opportunity Designed — Leads."
   Copy its ID from the URL — the long part between `/d/` and `/edit`.

2. **Create the Apps Script.** Go to script.new (this makes a new Apps Script project). Delete
   the sample code, and paste in the contents of `leads-apps-script.gs` (in this folder).

3. **Fill in the 2 config values** at the top of the script:
   - `SHEET_ID` → the Sheet ID from step 1
   - `OWNER_EMAIL` → already set to adelitamorrow@gmail.com

4. **Deploy.** Click **Deploy → New deployment → Web app**. Set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   Click Deploy, authorize when prompted (it'll warn it's unverified — that's normal for your
   own script; click Advanced → Go to project → Allow).

5. **Copy the Web app URL** — it ends in `/exec`. That's the value the website needs.

6. **Connect it to the site.** In each page's code, the line
   `const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";` gets your `/exec` URL. (Send it to me
   and I'll set it across all pages, or edit it yourself.)

**Test:** submit the form on the site → you should see a new row in the Sheet, a notification in
your inbox, and a confirmation email at the address you entered.

---

_Note: booking is intentionally handled by you, not the website. If you ever want to add a
self-serve booking link (Google Calendar, Calendly, Cal.com all have free tiers), just say so
and I'll wire it back in._
