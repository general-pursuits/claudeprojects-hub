// ╔══════════════════════════════════════════════════════════════════╗
// ║  OPPORTUNITY DESIGNED — INQUIRY WORKFLOW                        ║
// ║  Google Apps Script                                            ║
// ║                                                                ║
// ║  This script does four things:                                 ║
// ║  1. Receives form submissions from your website                ║
// ║  2. Logs them to your Google Sheet tracker                     ║
// ║  3. Sends you a rich email notification                        ║
// ║  4. Sends the inquiry sender an auto-confirmation              ║
// ║                                                                ║
// ║  SETUP: See the setup guide for step-by-step instructions.     ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── CONFIGURATION ───
// Change these to match your setup:
const CONFIG = {
  NOTIFICATION_EMAIL: "adelitamorrow@gmail.com",
  SHEET_NAME: "Inquiry Tracker",
  SPREADSHEET_ID: "YOUR_SPREADSHEET_ID_HERE",  // <-- Replace after uploading the sheet
  RESPONSE_WINDOW: "1–2 business days",         // <-- Shown in the auto-confirmation email
};


// ─── MAIN HANDLER ───
// This runs when someone submits the contact form on your website.

function doPost(e) {
  try {
    // Parse the form data
    const data = JSON.parse(e.postData.contents);

    // Log to sheet
    const row = logInquiry(data);

    // Send email notification to you
    sendNotification(data, row);

    // Send auto-confirmation to the inquiry sender
    if (data.email) {
      sendConfirmation(data);
    }

    // Return success (redirects user to thank-you message)
    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ─── LOG INQUIRY TO SHEET ───

function logInquiry(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  // Find next empty row
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;

  // Generate inquiry ID
  const id = newRow - 1; // Row 2 = ID 1, Row 3 = ID 2, etc.

  // Current timestamp
  const now = new Date();

  // Write the row
  // Columns: ID, Date, Name, Email, Company, Service Interest, Message, Status, Priority,
  //          Follow-Up Date, Response Notes, Next Action, Revenue Potential, Source, Last Updated
  sheet.getRange(newRow, 1, 1, 15).setValues([[
    id,                                    // A: ID
    now,                                   // B: Date Received
    data.name || "",                       // C: Name
    data.email || "",                      // D: Email
    data.company || "",                    // E: Company
    data.interest || "",                   // F: Service Interest
    data.message || "",                    // G: Message
    "New",                                 // H: Status (always starts as New)
    "",                                    // I: Priority (you set this)
    "",                                    // J: Follow-Up Date
    "",                                    // K: Response Notes
    "Review and respond",                  // L: Next Action
    "",                                    // M: Revenue Potential
    "Website Form",                        // N: Source
    now,                                   // O: Last Updated
  ]]);

  // Format date cells
  sheet.getRange(newRow, 2).setNumberFormat("MM/dd/yyyy");
  sheet.getRange(newRow, 15).setNumberFormat("MM/dd/yyyy");

  return newRow;
}


// ─── SEND EMAIL NOTIFICATION ───

function sendNotification(data, row) {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheetUrl = ss.getUrl() + "#gid=0&range=A" + row;

  // Build the subject line
  const subject = "New Inquiry: " + (data.name || "Unknown") +
    (data.company ? " — " + data.company : "");

  // Build the HTML email body
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1C1916;">

      <!-- Header -->
      <div style="background: #1C1916; padding: 24px 32px; margin-bottom: 0;">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #F7F2E8;">THE STRATEGY <span style="color: #5C4A82;">STUDIO</span></span>
        <div style="font-size: 11px; color: #8A7D6E; margin-top: 4px;">New website inquiry</div>
      </div>

      <!-- Body -->
      <div style="background: #F7F2E8; padding: 32px; border: 1px solid #EFE9D8;">

        <!-- Quick summary -->
        <div style="margin-bottom: 24px;">
          <div style="font-size: 22px; font-weight: 700; color: #1C1916; margin-bottom: 4px;">${data.name || "No name provided"}</div>
          <div style="font-size: 14px; color: #8A7D6E;">${data.company || "No company"} &middot; ${data.interest || "No service selected"}</div>
        </div>

        <!-- Full details -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr style="border-bottom: 1px solid #EFE9D8;">
            <td style="padding: 10px 0; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7D6E; width: 120px; vertical-align: top;">Email</td>
            <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${data.email || ""}" style="color: #5C4A82; text-decoration: none;">${data.email || "Not provided"}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #EFE9D8;">
            <td style="padding: 10px 0; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7D6E; vertical-align: top;">Company</td>
            <td style="padding: 10px 0; font-size: 14px;">${data.company || "Not provided"}</td>
          </tr>
          <tr style="border-bottom: 1px solid #EFE9D8;">
            <td style="padding: 10px 0; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7D6E; vertical-align: top;">Interested in</td>
            <td style="padding: 10px 0; font-size: 14px;">${data.interest || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7D6E; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; font-size: 14px; line-height: 1.6;">${(data.message || "No message").replace(/\\n/g, "<br>")}</td>
          </tr>
        </table>

        <!-- Action buttons -->
        <div style="margin-bottom: 24px;">
          <a href="mailto:${data.email || ""}?subject=Re: Your inquiry to The Opportunity Designed&body=%0A%0A—%0AAddie Morrow%0AThe Opportunity Designed%0Aadelit amorrow@gmail.com"
             style="display: inline-block; padding: 12px 24px; background: #5C4A82; color: #ffffff; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; margin-right: 12px;">
            Reply directly
          </a>
          <a href="${sheetUrl}"
             style="display: inline-block; padding: 12px 24px; background: #1C1916; color: #F7F2E8; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;">
            Open in tracker
          </a>
        </div>

        <div style="font-size: 12px; color: #8A7D6E; border-top: 1px solid #EFE9D8; padding-top: 16px;">
          This inquiry has been logged to your <a href="${ss.getUrl()}" style="color: #5C4A82;">Inquiry Tracker</a> with status <strong>New</strong>. Update the status and add notes directly in the sheet.
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; font-size: 11px; color: #8A7D6E;">
        Strategy that holds. &middot; Salt Lake City, UT
      </div>
    </div>
  `;

  // Send the email
  // replyTo is set to the inquiry sender so you can hit "Reply" in Gmail
  // and it goes directly to them
  GmailApp.sendEmail(
    CONFIG.NOTIFICATION_EMAIL,
    subject,
    // Plain text fallback
    "New inquiry from " + (data.name || "Unknown") + " (" + (data.email || "no email") + ")\n" +
    "Company: " + (data.company || "N/A") + "\n" +
    "Interest: " + (data.interest || "N/A") + "\n" +
    "Message: " + (data.message || "N/A") + "\n\n" +
    "View in tracker: " + sheetUrl,
    {
      htmlBody: html,
      replyTo: data.email || CONFIG.NOTIFICATION_EMAIL,
      name: "The Opportunity Designed — Inquiry Bot"
    }
  );
}


// ─── SEND AUTO-CONFIRMATION TO INQUIRY SENDER ───

function sendConfirmation(data) {
  const firstName = (data.name || "").split(" ")[0] || "there";

  const subject = "We received your inquiry — The Opportunity Designed";

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1C1916;">

      <!-- Header -->
      <div style="background: #1C1916; padding: 24px 32px; margin-bottom: 0;">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #F7F2E8;">THE STRATEGY <span style="color: #5C4A82;">STUDIO</span></span>
      </div>

      <!-- Body -->
      <div style="background: #F7F2E8; padding: 32px; border: 1px solid #EFE9D8;">

        <div style="font-size: 22px; font-weight: 700; color: #1C1916; margin-bottom: 16px; line-height: 1.3;">
          Thanks for reaching out, ${firstName}.
        </div>

        <p style="font-size: 15px; line-height: 1.7; color: #1C1916; margin-bottom: 20px;">
          I received your inquiry${data.interest && data.interest !== "Not sure yet" ? " about <strong>" + data.interest + "</strong>" : ""} and will review it personally. You can expect to hear back from me within <strong>${CONFIG.RESPONSE_WINDOW}</strong>.
        </p>

        <p style="font-size: 15px; line-height: 1.7; color: #1C1916; margin-bottom: 20px;">
          In the meantime, if anything else comes to mind — additional context, a timeline, documents — feel free to reply directly to this email.
        </p>

        <!-- What you sent -->
        <div style="background: #EFE9D8; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
          <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8A7D6E; margin-bottom: 12px;">What you sent</div>
          ${data.company ? '<div style="font-size: 13px; color: #8A7D6E; margin-bottom: 4px;">' + data.company + '</div>' : ''}
          ${data.interest ? '<div style="font-size: 13px; color: #8A7D6E; margin-bottom: 12px;">' + data.interest + '</div>' : ''}
          ${data.message ? '<div style="font-size: 14px; color: #1C1916; line-height: 1.6;">' + data.message.replace(/\n/g, "<br>") + '</div>' : ''}
        </div>

        <p style="font-size: 15px; line-height: 1.7; color: #1C1916; margin-bottom: 0;">
          Talk soon,<br>
          <strong>Addie Morrow</strong><br>
          <span style="font-size: 13px; color: #8A7D6E;">Founder, The Opportunity Designed</span>
        </p>

      </div>

      <!-- Footer -->
      <div style="padding: 16px 32px; font-size: 11px; color: #8A7D6E;">
        Strategy that holds. &middot; Salt Lake City, UT
      </div>
    </div>
  `;

  const plainText =
    "Hi " + firstName + ",\n\n" +
    "Thanks for reaching out. I received your inquiry and will review it personally. " +
    "You can expect to hear back within " + CONFIG.RESPONSE_WINDOW + ".\n\n" +
    "If anything else comes to mind, feel free to reply directly to this email.\n\n" +
    "Talk soon,\nAddie Morrow\nThe Opportunity Designed";

  GmailApp.sendEmail(
    data.email,
    subject,
    plainText,
    {
      htmlBody: html,
      replyTo: CONFIG.NOTIFICATION_EMAIL,
      name: "Addie Morrow — The Opportunity Designed"
    }
  );
}


// ─── TEST FUNCTION ───
// Run this manually in Apps Script to verify everything works.
// It creates a fake submission so you can see the email and sheet row.

function testSubmission() {
  const fakeData = {
    name: "Test Person",
    email: "test@example.com",
    company: "Test Company",
    interest: "Category & Assortment Strategy",
    message: "This is a test submission to verify the workflow is working correctly. You can delete this row from the tracker after confirming."
  };

  const row = logInquiry(fakeData);
  sendNotification(fakeData, row);
  sendConfirmation(fakeData);
  Logger.log("Test complete. Check your email and row " + row + " in the sheet.");
  Logger.log("Also check " + fakeData.email + " for the auto-confirmation (will go to your inbox since test@example.com isn't real).");
}
