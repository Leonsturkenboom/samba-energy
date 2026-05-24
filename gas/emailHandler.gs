var SENDER_NAME = 'SAMBA.Energy';
var NOTIFY_EMAIL = 'leon@samba.energy';
var NOTIFY_CC = 'andy@samba.energy';
var PDF_URL = 'https://samba.energy/rapport-voorbeeld.pdf';

// Vul het ID van je Google Sheet in om leads automatisch te loggen.
// Sheet ID staat in de URL: docs.google.com/spreadsheets/d/[DIT_ID]/edit
var SHEET_ID = '';

function isValidEmail(email) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidPhone(phone) {
  if (!phone || !phone.trim()) return true;
  var digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

function getPdfBlob() {
  var cache = CacheService.getScriptCache();
  try {
    var cached = cache.get('samba_pdf');
    if (cached) {
      var bytes = Utilities.base64Decode(cached);
      return Utilities.newBlob(bytes, 'application/pdf', 'Voorbeeld_Rapport_SAMBA.Energy.pdf');
    }
  } catch(e) {}
  var blob = UrlFetchApp.fetch(PDF_URL).getBlob();
  blob.setName('Voorbeeld_Rapport_SAMBA.Energy.pdf');
  try {
    var b64 = Utilities.base64Encode(blob.getBytes());
    if (b64.length < 90000) cache.put('samba_pdf', b64, 21600);
  } catch(e) {}
  return blob;
}

function logToSheet(data, status) {
  if (!SHEET_ID) return;
  try {
    var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
    sheet.appendRow([
      new Date(),
      data.type || '',
      data.lang || '',
      data.companyName || '',
      data.contactPerson || '',
      data.email || '',
      data.phone || '',
      data.situation || '',
      data.optin_updates || '',
      status || 'ok'
    ]);
  } catch(e) {}
}

function sendErrorNotification(context, err) {
  try {
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      'SAMBA form error — ' + context,
      String(err),
      { name: SENDER_NAME }
    );
  } catch(e) {}
}

function signatureHTML(lang) {
  var greeting = lang === 'en' ? 'Kind regards,' : 'Met vriendelijke groet,';
  return '<div style="margin-top:28px;">' +
    '<p style="margin:0 0 20px;font-family:\'Courier New\',Courier,monospace;font-size:15px;color:#555;">' + greeting + '</p>' +
    '<p style="margin:0 0 16px;font-family:\'Courier New\',Courier,monospace;font-size:15px;font-weight:400;color:#111111;">Leon Sturkenboom</p>' +
    '<div style="margin:14px 0;">' +
    '<a href="https://samba.energy" style="display:inline-block;">' +
    '<img src="https://samba.energy/images/samba-logo-email.png" width="240" alt="SAMBA.Energy" style="display:block;">' +
    '</a>' +
    '</div>' +
    '<p style="margin:0;font-family:\'Courier New\',Courier,monospace;font-size:15px;color:#555;">' +
    '<a href="https://samba.energy" style="color:#2563eb;text-decoration:none;">www.SAMBA.Energy</a> /// 06 46444468</p>' +
    '</div>';
}

function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'parse_error' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Honeypot — bot detected, silently discard
  if (data.honeypot) {
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var type = data.type || 'Aanvraag';
  var lang = data.lang || 'nl';
  var companyName = data.companyName || '';
  var contactPerson = data.contactPerson || '';
  var email = data.email || '';
  var phone = data.phone || '';
  var situation = data.situation || '';
  var optin = data.optin_updates || '';

  // Input validation
  if (!isValidEmail(email)) {
    logToSheet(data, 'invalid_email');
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'invalid_email' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  if (!isValidPhone(phone)) {
    logToSheet(data, 'invalid_phone');
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'invalid_phone' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var isAnalysis = type.toLowerCase().indexOf('demo') === -1;
  var isEN = lang === 'en';

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

  try {
    GmailApp.sendEmail(
      NOTIFY_EMAIL,
      notificationSubject,
      notificationBody,
      { cc: NOTIFY_CC, name: SENDER_NAME }
    );
  } catch(err) {
    sendErrorNotification('notification email', err);
  }

  if (email) {
    var subject, htmlBody;

    if (isEN) {
      subject = isAnalysis
        ? 'Energy scan requested. We\'ll be in touch.'
        : 'Demo requested. We\'ll be in touch.';
      htmlBody = isAnalysis
        ? buildAnalysisEmailEN(contactPerson, companyName)
        : buildDemoEmailEN(contactPerson, companyName);
    } else {
      subject = isAnalysis
        ? 'Energiescan aangevraagd. We nemen snel contact met je op.'
        : 'Demo aangevraagd. We nemen snel contact met je op.';
      htmlBody = isAnalysis
        ? buildAnalysisEmailNL(contactPerson, companyName)
        : buildDemoEmailNL(contactPerson, companyName);
    }

    try {
      if (isAnalysis) {
        var pdfBlob = getPdfBlob();
        GmailApp.sendEmail(email, subject, '', {
          htmlBody: htmlBody,
          attachments: [pdfBlob],
          name: SENDER_NAME
        });
      } else {
        GmailApp.sendEmail(email, subject, '', {
          htmlBody: htmlBody,
          name: SENDER_NAME
        });
      }
    } catch(err) {
      sendErrorNotification('confirmation email to ' + email, err);
      // Try without PDF if attachment failed
      try {
        GmailApp.sendEmail(email, subject, '', {
          htmlBody: htmlBody,
          name: SENDER_NAME
        });
      } catch(err2) {}
    }
  }

  logToSheet(data, 'ok');

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function emailWrapper(body, lang) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:#ffffff;">' +
    '<table width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td align="center">' +
    '<table width="720" cellpadding="0" cellspacing="0" style="max-width:720px;width:100%;background:#ffffff;">' +
    '<tr><td style="padding:40px 36px 44px;text-align:center;">' +
    '<a href="https://samba.energy" style="display:inline-block;">' +
    '<img src="https://samba.energy/Logo%20SAMBA.svg" width="120" alt="SAMBA.Energy" style="display:block;">' +
    '</a>' +
    '</td></tr>' +
    '<tr><td style="padding:0 36px 40px;">' +
    body + signatureHTML(lang || 'nl') +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table></body></html>';
}

function serviceBlocks(block1Title, block1Body, block2Title, block2Body) {
  return '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">' +
    '<tr><td style="border-left:3px solid #E8F53A;padding:12px 0 12px 20px;vertical-align:top;">' +
    '<p style="font-family:\'Courier New\',Courier,monospace;font-size:14px;font-weight:700;color:#111111;margin:0 0 8px;">' + block1Title + '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;color:#555555;line-height:1.7;margin:0;">' + block1Body + '</p>' +
    '</td></tr>' +
    '<tr><td style="height:12px;"></td></tr>' +
    '<tr><td style="border-left:3px solid #111111;padding:12px 0 12px 20px;vertical-align:top;">' +
    '<p style="font-family:\'Courier New\',Courier,monospace;font-size:14px;font-weight:700;color:#111111;margin:0 0 8px;">' + block2Title + '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;color:#555555;line-height:1.7;margin:0;">' + block2Body + '</p>' +
    '</td></tr>' +
    '</table>';
}

function buildAnalysisEmailNL(name, company) {
  var bullets =
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Kosten &amp; Capaciteit:</strong> Structurele besparingen en de resterende ruimte op je netaansluiting.</td></tr>' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Continuïteit &amp; Groei:</strong> Hoe je ondanks netcongestie kunt blijven groeien, elektrificeren en productiecontinuïteit kunt garanderen.</td></tr>' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Extra Kansen:</strong> Mogelijke inzet van flexcontracten (netbeheer) en beschikbare subsidies.</td></tr>' +
    '</table>';
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Beste ' + (name || '[NAAM]') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor je interesse in <strong>SAMBA.Energy</strong>. We hebben je aanvraag voor een energiescan van ' + (company || 'je bedrijf') + ' in goede orde ontvangen.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Met deze scan brengen we direct jouw kansen in kaart. Je krijgt concreet inzicht in:</p>' +
    bullets +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Wij nemen zo snel mogelijk contact met je op om de situatie en de gewenste aanpak te bespreken. Alvast twee varianten van de rapportage om over na te denken:</p>' +
    serviceBlocks(
      'Slim met energie Check',
      'Snelle analyse op basis van meter- of aangeleverde data. Je krijgt direct inzicht in besparingspotentieel en beschikbare netcapaciteit. Resultaat binnen 5 werkdagen.',
      'Slim met energie Deep-dive',
      'Uitgebreide on-site analyse met 2 weken meting op locatie. We brengen samen in kaart welke assets flexibel inzetbaar zijn en wat het je oplevert. De hoogste mate van zekerheid.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">In de bijlage vind je alvast een voorbeeld van het rapport. Heb je vooraf al specifieke vragen of wensen? Neem gerust contact met me op.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">We spreken elkaar snel!</p>'
  );
}

function buildDemoEmailNL(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Beste ' + (name || '[NAAM]') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor je interesse. We hebben je aanvraag voor een demo van ons asset- en energiemanagement platform voor ' + (company || 'je bedrijf') + ' in goede orde ontvangen.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Tijdens de demo kijken we samen hoe <strong>SAMBA.Energy</strong> ervoor zorgt dat jouw assets optimaal kunnen worden ingezet. We nemen zo snel mogelijk contact met je op om een datum en tijdstip te plannen. Alvast twee opties om over na te denken:</p>' +
    serviceBlocks(
      'Online via video call',
      'Snel en efficiënt. Ideaal voor een eerste indruk van ons platform en de mogelijke besparingsmogelijkheden in de specifieke situatie van ' + (company || 'je bedrijf') + '.',
      'Fysiek op locatie',
      'Voor een uitgebreidere kennismaking en een diepere duik in de flex-asset optimalisatie kansen. We kunnen dan direct de situatie ter plekke bekijken, de specifieke apparaten en installaties toetsen en de beste aanpak voor jullie situatie bepalen.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">De demo duurt ongeveer 30–60 minuten. Heb je vooraf al specifieke vragen of wensen? Neem gerust contact met me op.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">We spreken elkaar snel!</p>'
  );
}

function buildAnalysisEmailEN(name, company) {
  var bullets =
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Cost &amp; Capacity:</strong> Structural savings and remaining capacity on your grid connection.</td></tr>' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Continuity &amp; Growth:</strong> How to keep growing, electrifying and guaranteeing production continuity despite grid congestion.</td></tr>' +
    '<tr><td style="padding:4px 0;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;">' +
    '<span style="color:#E8F53A;font-weight:700;margin-right:10px;">+</span><strong>Extra Opportunities:</strong> Possible use of flex contracts (grid operator) and available subsidies.</td></tr>' +
    '</table>';
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Dear ' + (name || '[NAME]') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in <strong>SAMBA.Energy</strong>. We have received your energy scan request for ' + (company || 'your company') + '.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">With this scan we immediately map out your opportunities. You will gain concrete insight into:</p>' +
    bullets +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">We will get in touch as soon as possible to discuss the situation and the best approach. Two report variants to consider:</p>' +
    serviceBlocks(
      'Smart Energy Check',
      'Quick analysis based on meter or shared data. Direct insight into savings potential and available grid capacity. Result within 5 working days.',
      'Smart Energy Deep-dive',
      'Comprehensive on-site analysis with 2 weeks of measurement on location. Together we map out which assets can be used flexibly and what it delivers. The highest level of certainty.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">In the attachment you will find a sample of the report. Do you already have specific questions or wishes? Feel free to reach out.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Talk soon!</p>',
    'en'
  );
}

function buildDemoEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Dear ' + (name || '[NAME]') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in <strong>SAMBA.Energy</strong>. We have received your demo request for our asset and energy management platform for ' + (company || 'your company') + '.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">During the demo we will explore together how <strong>SAMBA.Energy</strong> ensures your assets can be used to their full potential. We will get in touch as soon as possible to schedule a date and time. Two options to consider:</p>' +
    serviceBlocks(
      'Online via video call',
      'Quick and efficient. Ideal for a first impression of our platform and the possible savings opportunities in the specific situation of ' + (company || 'your company') + '.',
      'On location',
      'For a more in-depth introduction and a closer look at flex-asset optimisation opportunities. We can directly review the situation on-site, assess specific equipment and installations, and determine the best approach for your situation.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">The demo takes approximately 30–60 minutes. Do you already have specific questions or wishes? Feel free to reach out.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Talk soon!</p>',
    'en'
  );
}

function doGet(e) {
  return ContentService.createTextOutput('SAMBA Email Handler Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
