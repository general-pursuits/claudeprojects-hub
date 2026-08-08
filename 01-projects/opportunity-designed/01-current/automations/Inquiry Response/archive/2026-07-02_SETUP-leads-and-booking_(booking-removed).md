# Lead tracking + booking — setup guide

Everything here is **free** and uses your existing Google account. Two pieces:

- **A. Lead tracking + emails** — the contact form logs every submission to a Google Sheet, emails you, and auto-sends the person a confirmation. (Google Sheet + Gmail via Apps Script.)
- **B. Booking calendar** — the "Schedule a Consultation" buttons open your Google Calendar appointment page. (Free, no third-party account.)

When you've done A and B, send me the **two URLs** (the Apps Script `/exec` URL and your booking link) and I'll drop them into the site — or follow the "paste into site" notes yourself.

---

## A. Lead tracking + confirmation emails

1. **Create the Google Sheet.** Go to sheets.new, name it "Opportunity Designed — Leads." Copy its ID from the URL — the long part between `/d/` and `/edit`.

2. **Create the Apps Script.** Go to script.new (this makes a new Apps Script project). Delete the sample code, and paste in the contents of `leads-apps-script.gs` (in this folder).

3. **Fill in the 3 config values** at the top of the script:
   - `SHEET_ID` → the Sheet ID from step 1
   - `OWNER_EMAIL` → already set to adelitamorrow@gmail.com
   - `BOOKING_URL` → your booking link from Part B (paste once you have it)

4. **Deploy.** Click **Deploy → New deployment → Web app**. Set:
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**
   Click Deploy, authorize when prompted (it'll warn it's unverified — that's normal for your own script; click Advanced → Go to project → Allow).

5. **Copy the Web app URL** — it ends in `/exec`. That's the value the website needs.

6. **Connect it to the site.** In each page's code, the line `const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL_HERE";` gets your `/exec` URL. (Send it to me and I'll set it across all pages, or edit it yourself.)

**Test:** submit the form on the site → you should see a new row in the Sheet, a notification in your inbox, and a confirmation email at the address you entered.

---

## B. Booking calendar (Google Calendar Appointment Scheduling — free)

1. Open **Google Calendar** → click **Create → Appointment schedule**.
2. Name it (e.g. "Consultation — Opportunity Designed"), set the length (e.g. 30 min) and your available hours.
3. Under booking form, your email/confirmation settings are built in (Google sends the invite + reminders automatically).
4. Click **Share → Open booking page** and copy that **public booking link**.

5. **Connect it to the site.** The "Schedule a Consultation" buttons currently point to a placeholder (`https://calendar.app.google/REPLACE-WITH-YOUR-BOOKING-LINK`). Send me your real link and I'll swap it everywhere, or replace that placeholder yourself.

*(Prefer Calendly or Cal.com instead? Both have free tiers — just send me whichever booking link and I'll wire the buttons to it. Google is the only fully free, no-extra-account option, which is why it's the default here.)*

---

## How the flow works once live

```
Visitor clicks "Schedule a Consultation"  ──▶  your Google booking page  ──▶  booked + auto-confirmed by Google
Visitor fills the contact form ("not ready") ──▶ Apps Script ──▶ row in your Sheet
                                                              ├─▶ notification email to you
                                                              └─▶ confirmation email to them (with a booking link)
```

You get a running lead log in the Sheet, instant notifications, every prospect gets an immediate professional reply, and consultation-ready visitors can book straight onto your calendar.
