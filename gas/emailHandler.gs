var SENDER_NAME = 'SAMBA.Energy';
var NOTIFY_EMAIL = 'leon@samba.energy';
var NOTIFY_CC = 'andy@samba.energy';
var PDF_URL = 'https://samba.energy/rapport-voorbeeld.pdf';
var SIGNATURE_HTML =
  '<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e8e8e8;font-family:monospace;font-size:13px;color:#333;">' +
  '<p style="margin:0 0 4px;">Met vriendelijke groet,</p>' +
  '<p style="margin:0 0 16px;font-weight:600;">Leon Sturkenboom</p>' +
  '<a href="https://samba.energy" style="display:inline-block;margin-bottom:12px;">' +
  '<img src="https://samba.energy/images/samba-logo-email.png" width="180" alt="SAMBA.Energy" style="display:block;">' +
  '</a>' +
  '<p style="margin:0;font-size:13px;"><a href="https://samba.energy" style="color:#2563eb;text-decoration:none;">www.SAMBA.energy</a> /// 06 46444468</p>' +
  '</div>';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var type = data.type || 'Aanvraag';
  var lang = data.lang || 'nl';
  var companyName = data.companyName || '';
  var contactPerson = data.contactPerson || '';
  var email = data.email || '';
  var phone = data.phone || '';
  var situation = data.situation || '';
  var optin = data.optin_updates || '';

  var isAnalysis = type.toLowerCase().indexOf('demo') === -1;
  var isEN = lang === 'en';

  // 1. Notificatiemail naar SAMBA team
  var notificationSubject = isAnalysis
    ? 'New request report — ' + companyName
    : 'New request demo — ' + companyName;

  var notificationBody =
    'Type: ' + type + '\n' +
    'Taal: ' + lang + '\n' +
    'Bedrijf: ' + companyName + '\n' +
    'Contactpersoon: ' + contactPerson + '\n' +
    'E-mail: ' + email + '\n' +
    'Telefoon: ' + phone + '\n' +
    'Situatie: ' + situation + '\n' +
    'Updates opt-in: ' + optin;

  GmailApp.sendEmail(
    NOTIFY_EMAIL,
    notificationSubject,
    notificationBody,
    { cc: NOTIFY_CC, name: SENDER_NAME }
  );

  // 2. Bevestigingsmail naar aanvrager
  if (email) {
    var subject, htmlBody;

    if (isEN) {
      subject = isAnalysis
        ? 'Calculate my savings with SAMBA.Energy'
        : 'Your demo request at SAMBA.Energy';
      htmlBody = isAnalysis
        ? buildAnalysisEmailEN(contactPerson, companyName)
        : buildDemoEmailEN(contactPerson, companyName);
    } else {
      subject = isAnalysis
        ? 'Bereken mijn besparing met SAMBA.Energy'
        : 'Jouw demoaanvraag bij SAMBA.Energy';
      htmlBody = isAnalysis
        ? buildAnalysisEmailNL(contactPerson, companyName)
        : buildDemoEmailNL(contactPerson, companyName);
    }

    if (isAnalysis) {
      try {
        var pdfBlob = UrlFetchApp.fetch(PDF_URL).getBlob();
        pdfBlob.setName('Voorbeeld_Rapport_SAMBA.Energy.pdf');
        GmailApp.sendEmail(email, subject, '', {
          htmlBody: htmlBody,
          attachments: [pdfBlob],
          name: SENDER_NAME
        });
      } catch (err) {
        // PDF niet bereikbaar — stuur mail zonder bijlage
        GmailApp.sendEmail(email, subject, '', {
          htmlBody: htmlBody,
          name: SENDER_NAME
        });
      }
    } else {
      GmailApp.sendEmail(email, subject, '', {
        htmlBody: htmlBody,
        name: SENDER_NAME
      });
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function emailWrapper(body) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">' +
    '<tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +
    '<tr><td style="background:#111111;border-radius:16px 16px 0 0;padding:22px 36px;">' +
    '<table width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="vertical-align:middle;">' +
    '<span style="font-family:\'Courier New\',Courier,monospace;font-size:15px;font-weight:700;color:#ffffff;letter-spacing:0.15em;">SAMBA.Energy</span>' +
    '</td>' +
    '<td style="vertical-align:middle;text-align:right;width:36px;">' +
    '<img src="https://samba.energy/images/logo-samba-header.png" width="32" height="32" alt="" style="display:block;margin-left:auto;">' +
    '</td>' +
    '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="background:#ffffff;padding:40px 36px;">' +
    body +
    SIGNATURE_HTML +
    '</td></tr>' +
    '<tr><td style="background:#f0f0f0;border-radius:0 0 16px 16px;padding:16px 36px;border-top:1px solid #e0e0e0;">' +
    '<p style="font-size:11px;color:#aaaaaa;margin:0;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.08em;">SAMBA.Energy &mdash; Smart Asset Management &amp; Business Automation</p>' +
    '</td></tr></table></td></tr></table></body></html>';
}

function buildAnalysisEmailNL(name, company) {
  return emailWrapper(
    '<h1 style="font-size:22px;font-weight:700;color:#111111;margin:0 0 16px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.04em;">Bedankt voor je aanvraag' + (name ? ', ' + name : '') + '.</h1>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We hebben je aanvraag voor <strong>' + (company || 'je bedrijf') + '</strong> ontvangen. Wij nemen zo snel mogelijk contact met je op om de situatie en de gewenste aanpak te bespreken.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 12px;">Twee opties om over na te denken:</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">' +
    '<tr><td style="border-left:3px solid #E8F53A;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-size:14px;color:#111111;font-weight:700;margin:0 0 4px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.06em;">SLIMME ENERGIE CHECK</p>' +
    '<p style="font-size:14px;color:#555555;line-height:1.7;margin:0;">Snelle analyse op basis van je slimme meter of aangeleverde data. Je krijgt direct inzicht in besparingspotentieel en beschikbare netcapaciteit. Resultaat binnen 5 werkdagen.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:8px 0;"></td></tr>' +
    '<tr><td style="border-left:3px solid #111111;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-size:14px;color:#111111;font-weight:700;margin:0 0 4px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.06em;">SLIMME ENERGIE RAPPORT</p>' +
    '<p style="font-size:14px;color:#555555;line-height:1.7;margin:0;">Uitgebreide on-site analyse met 2 weken meting op locatie. We brengen samen in kaart welke assets flexibel inzetbaar zijn om je energiekosten maximaal te verlagen. De hoogste mate van zekerheid.</p>' +
    '</td></tr>' +
    '</table>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">In de bijlage vind je alvast een voorbeeld van ons Energy &amp; Cost Savings rapport. Na onze analyse ontvang je een persoonlijk rapport voor <strong>' + (company || 'je bedrijf') + '</strong>, inclusief advies over zonnepanelen en batterijopslag.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Vragen? Neem gerust contact met me op.</p>'
  );
}

function buildDemoEmailNL(name, company) {
  return emailWrapper(
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Beste' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor je interesse in SAMBA.Energy. We hebben je demoaanvraag voor <strong>' + (company || 'je bedrijf') + '</strong> ontvangen.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Wij nemen zo snel mogelijk contact met je op om een datum en tijdstip in te plannen. Dan kijken we samen hoe SAMBA.Energy je energie-assets optimaal kan benutten.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">De demo duurt ongeveer 30&ndash;45 minuten en kan op twee manieren:</p>' +
    '<ul style="font-size:15px;color:#444444;line-height:1.9;margin:0 0 20px;padding-left:20px;">' +
    '<li><strong>Online via videocall</strong> &mdash; snel en effici&euml;nt.</li>' +
    '<li><strong>Op locatie</strong> &mdash; dan kunnen we direct de situatie bekijken.</li>' +
    '</ul>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Specifieke vragen of wensen voor de demo? Laat het gerust weten via een reply op deze mail.</p>'
  );
}

function buildAnalysisEmailEN(name, company) {
  return emailWrapper(
    '<h1 style="font-size:22px;font-weight:700;color:#111111;margin:0 0 16px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.04em;">Thanks for your request' + (name ? ', ' + name : '') + '.</h1>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We have received your request for <strong>' + (company || 'your company') + '</strong>. We will get in touch as soon as possible to discuss your situation and the best approach.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 12px;">Two options to consider:</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">' +
    '<tr><td style="border-left:3px solid #E8F53A;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-size:14px;color:#111111;font-weight:700;margin:0 0 4px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.06em;">SMART ENERGY CHECK</p>' +
    '<p style="font-size:14px;color:#555555;line-height:1.7;margin:0;">Quick analysis based on your smart meter or shared data. Immediate insight into savings potential and available grid capacity. Result within 5 working days.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:8px 0;"></td></tr>' +
    '<tr><td style="border-left:3px solid #111111;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-size:14px;color:#111111;font-weight:700;margin:0 0 4px;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.06em;">SMART ENERGY REPORT</p>' +
    '<p style="font-size:14px;color:#555555;line-height:1.7;margin:0;">Comprehensive on-site analysis with 2 weeks of measurement on location. Together we map out which assets can be used flexibly to maximally reduce your energy costs. The highest level of certainty.</p>' +
    '</td></tr>' +
    '</table>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Attached you will find a sample of our Energy &amp; Cost Savings report. After our analysis, you will receive a personal report for <strong>' + (company || 'your company') + '</strong>, including advice on solar panels and battery storage.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Questions? Feel free to reach out.</p>'
  );
}

function buildDemoEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Dear' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in SAMBA.Energy. We have received your demo request for <strong>' + (company || 'your company') + '</strong>.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We will contact you as soon as possible to schedule a date and time. Together we will explore how SAMBA.Energy can optimally utilise your energy assets.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">The demo takes approximately 30&ndash;45 minutes and can take place in two ways:</p>' +
    '<ul style="font-size:15px;color:#444444;line-height:1.9;margin:0 0 20px;padding-left:20px;">' +
    '<li><strong>Online via video call</strong> &mdash; quick and efficient.</li>' +
    '<li><strong>On location</strong> &mdash; then we can take a direct look at the situation.</li>' +
    '</ul>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Specific questions or wishes for the demo? Feel free to let us know in a reply to this email.</p>'
  );
}

function doGet(e) {
  return ContentService.createTextOutput('SAMBA Email Handler Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
