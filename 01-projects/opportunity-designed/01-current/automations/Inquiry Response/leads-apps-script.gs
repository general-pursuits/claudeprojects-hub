/**
 * OPPORTUNITY DESIGNED — website lead handler
 * Logs every contact-form submission to a Google Sheet,
 * emails Addie a notification, and auto-sends the submitter a confirmation.
 *
 * SETUP: fill in the two CONFIG values below, then Deploy as a Web app
 * (Execute as: Me · Who has access: Anyone). Paste the /exec URL into the
 * website's APPS_SCRIPT_URL. Full steps in SETUP-leads.md.
 *
 * FLOW: message-only. There is no direct booking on the site. Every lead
 * comes through the contact form; Addie reviews it and reaches out to
 * schedule a consultation when it's a fit.
 */

// ─── CONFIG ───────────────────────────────────────────────
var SHEET_ID    = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";          // from the Sheet URL: /d/THIS_PART/edit
var OWNER_EMAIL = "adelitamorrow@gmail.com";                  // where lead notifications go
var FROM_NAME   = "Opportunity Designed";
// ──────────────────────────────────────────────────────────

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents);

    // 1) Log to the sheet
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Leads")
             || SpreadsheetApp.openById(SHEET_ID).insertSheet("Leads");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp","Full Name","Company","Email","Website",
                       "Focus Areas","What prompted them","Success looks like",
                       "Anything else","Timing","Heard about"]);
    }
    sheet.appendRow([new Date(), d.fullName||"", d.companyName||"", d.email||"",
                     d.website||"", d.focus||"", d.prompted||"", d.outcome||"",
                     d.anything||"", d.timing||"", d.hearAbout||""]);

    // 2) Notify Addie
    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: "New inquiry: " + (d.fullName||"Website") + (d.companyName ? " · " + d.companyName : ""),
      htmlBody:
        "<b>New inquiry from opportunitydesigned.com</b><br><br>" +
        row("Name", d.fullName) + row("Company", d.companyName) +
        row("Email", d.email) + row("Website", d.website) +
        row("Focus areas", d.focus) + row("Timing", d.timing) +
        row("Heard about", d.hearAbout) +
        "<br><b>What prompted them</b><br>" + esc(d.prompted) +
        (d.anything ? "<br><br><b>Anything else</b><br>" + esc(d.anything) : "") +
        "<br><br><b>Success looks like</b><br>" + esc(d.outcome)
    });

    // 3) Confirmation to the submitter
    if (d.email) {
      var first = (d.fullName || "there").split(" ")[0];
      MailApp.sendEmail({
        to: d.email,
        name: FROM_NAME,
        subject: "Thank you for reaching out — Opportunity Designed",
        htmlBody:
          "Hi " + esc(first) + ",<br><br>" +
          "Thank you for reaching out. I've received your inquiry and will personally review it. " +
          "If it looks like a strong fit, I'll be in touch within 1 to 2 business days to set up a consultation.<br><br>" +
          "Warmly,<br>Addie Morrow<br>Opportunity Designed<br>" +
          "<span style=\"color:#888\">Opportunity doesn't appear. It's built.</span>"
      });
    }

    return ContentService.createTextOutput(JSON.stringify({ok:true}))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    MailApp.sendEmail(OWNER_EMAIL, "Website form ERROR", String(err) + "\n\n" + (e && e.postData ? e.postData.contents : ""));
    return ContentService.createTextOutput(JSON.stringify({ok:false}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function row(label, val){ return val ? "<b>"+label+":</b> "+esc(val)+"<br>" : ""; }
function esc(s){ return (s==null?"":String(s)).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"); }
