/* Opportunity Designed — Silktide Consent Manager config (v2.0.1)
   OPT-OUT MODEL (US posture, per Addie 2026-07-29):
   - Analytics (GA4) and Marketing (HubSpot, LinkedIn) run by default.
   - Banner informs and records choices; an explicit rejection stops the
     category (gtag consent denied + page reload so nothing loads next time).
   - The <head> snippet sets Consent Mode defaults from the stored choice
     before any Google script runs. */
(function () {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function choice(id) {
    try { var v = localStorage.getItem('stcm.consent.' + id); return v === null ? null : v === 'true'; }
    catch (e) { return null; }
  }
  function loadScript(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }

  var OD = window.__od = window.__od || {};

  OD.loadAnalytics = function () {
    if (OD.a) return; OD.a = true;
    gtag('js', new Date());
    gtag('config', 'G-M1FVLM07Z1', { anonymize_ip: true, transport_type: 'beacon' });
    loadScript('https://www.googletagmanager.com/gtag/js?id=G-M1FVLM07Z1');
    /* Page-load conversion event (booked/thank-you pages set window.__odPageEvent) */
    if (window.__odPageEvent && !window.__odPageEventSent) {
      window.__odPageEventSent = true;
      gtag('event', window.__odPageEvent[0], window.__odPageEvent[1] || {});
    }
    /* Click/event tracking (from legacy analytics.js) — attach once */
    if (!OD.t) {
      OD.t = true;
      var track = function (name, params) { gtag('event', name, params || {}); };
      document.addEventListener('click', function (event) {
        var link = event.target.closest('a[href]');
        if (!link) return;
        var href = link.href;
        if (href.indexOf('cal.com/opportunitydesigned/opportunity-review') !== -1) {
          track('begin_checkout', { currency: 'USD', value: 450, items: [{ item_id: 'opportunity-review', item_name: 'Opportunity Review', price: 450, quantity: 1 }], link_url: href });
        } else if (href.indexOf('cal.com/opportunitydesigned/project-fit-call') !== -1) {
          track('book_project_fit_call', { link_url: href });
        } else if (link.protocol === 'mailto:') {
          track('email_click', { link_url: href });
        } else if (link.hostname && link.hostname !== window.location.hostname) {
          track('outbound_click', { link_url: href, link_domain: link.hostname });
        }
      });
      if (document.body && document.body.dataset.pageType === '404') {
        track('page_not_found', { page_location: window.location.href });
      }
    }
  };

  OD.loadMarketing = function () {
    if (OD.m) return; OD.m = true;
    window._linkedin_partner_id = '556095600';
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
    window.lintrk = window.lintrk || function (a, b) { (window.lintrk.q = window.lintrk.q || []).push([a, b]); };
    loadScript('https://js.hs-scripts.com/246790245.js');
    loadScript('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  };

  /* Opt-out: load unless the visitor has explicitly rejected */
  if (choice('analytics') !== false) OD.loadAnalytics();
  if (choice('marketing') !== false) OD.loadMarketing();

  var reloadQueued = false;
  function rejectionReload(loadedFlag) {
    /* Reload ONLY if this category's scripts ran on this page load — Silktide
       re-fires onReject on every load for stored rejections, and without this
       guard that would loop reloads forever. */
    return function () {
      if (!loadedFlag()) return;
      if (reloadQueued) return; reloadQueued = true;
      setTimeout(function () { window.location.reload(); }, 250);
    };
  }
  var rejectAnalytics = rejectionReload(function () { return !!OD.a; });
  var rejectMarketing = rejectionReload(function () { return !!OD.m; });

  window.silktideConsentManager.init({
    backdrop: { show: false },
    icon: { position: "bottomLeft" },
    prompt: { position: "bottomRight" },
    consentTypes: [
      {
        id: "essential",
        label: "Essential",
        description: "<p>Required for the site to work: security, form submission, and remembering the cookie choice you make here. These can’t be switched off.</p>",
        required: true,
        onAccept: function () {}
      },
      {
        id: "analytics",
        label: "Analytics",
        description: "<p>Google Analytics helps us see which pages are useful and how visitors find the site. IP addresses are anonymized. On unless you turn it off.</p>",
        required: false,
        defaultValue: true,
        gtag: ["analytics_storage"],
        onAccept: OD.loadAnalytics,
        onReject: rejectAnalytics
      },
      {
        id: "marketing",
        label: "Marketing",
        description: "<p>Used by us and advertising partners (HubSpot, LinkedIn) to measure campaigns and show relevant ads. On unless you turn it off.</p>",
        required: false,
        defaultValue: true,
        gtag: ["ad_storage", "ad_user_data", "ad_personalization"],
        onAccept: OD.loadMarketing,
        onReject: rejectMarketing
      }
    ],
    text: {
      prompt: {
        description: "<p>We use cookies to understand how the site is used and to measure our marketing. Opt out anytime — here or via the corner icon.</p>",
        acceptAllButtonText: "OK",
        acceptAllButtonAccessibleLabel: "Accept all cookies",
        rejectNonEssentialButtonText: "Opt out",
        rejectNonEssentialButtonAccessibleLabel: "Reject all non-essential cookies",
        preferencesButtonText: "Preferences",
        preferencesButtonAccessibleLabel: "Toggle preferences"
      },
      preferences: {
        title: "Cookie preferences",
        description: "<p>Choose what you’re comfortable with. Your choice applies across the site and you can change it anytime via the icon in the corner. Details in our <a href=\"/privacy\">Privacy Policy</a>.</p>",
        saveButtonText: "Save and close",
        saveButtonAccessibleLabel: "Save your cookie preferences"
      }
    }
  });
})();
