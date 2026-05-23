var SENDER_NAME = 'SAMBA.Energy';
var NOTIFY_EMAIL = 'leon@samba.energy';
var NOTIFY_CC = 'andy@samba.energy';
var PDF_URL = 'https://samba.energy/rapport-voorbeeld.pdf';

function signatureHTML(lang) {
  var greeting = lang === 'en' ? 'Kind regards,' : 'Met vriendelijke groet,';
  return '<div style="margin-top:28px;">' +
    '<p style="margin:0 0 20px;font-family:\'Courier New\',Courier,monospace;font-size:15px;color:#555;">' + greeting + '</p>' +
    '<p style="margin:0 0 16px;font-family:\'Courier New\',Courier,monospace;font-size:15px;font-weight:400;color:#111111;">Leon Sturkenboom</p>' +
    '<div style="margin:14px 0;">' +
    '<img src="https://samba.energy/images/samba-logo-email.png" width="160" alt="SAMBA.Energy" style="display:block;">' +
    '</div>' +
    '<p style="margin:0;font-family:\'Courier New\',Courier,monospace;font-size:15px;color:#555;">' +
    '<a href="https://samba.energy" style="color:#2563eb;text-decoration:none;">www.SAMBA.energy</a> /// 06 46444468</p>' +
    '</div>';
}

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

function emailWrapper(body, lang) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
    '<body style="margin:0;padding:0;background:#ffffff;">' +
    '<table width="100%" cellpadding="0" cellspacing="0">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">' +
    '<tr><td style="padding:40px 36px 44px;text-align:center;">' +
    '<img src="https://samba.energy/Logo%20SAMBA.svg" width="200" alt="SAMBA.Energy" style="display:inline-block;">' +
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
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Beste' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We hebben je aanvraag voor een energiescan voor <strong>' + (company || 'je bedrijf') + '</strong> ontvangen. Wij nemen zo snel mogelijk contact met je op om de situatie en de gewenste aanpak te bespreken.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Alvast twee opties om over na te denken:</p>' +
    serviceBlocks(
      'Slimme Energie Check',
      'Snelle analyse op basis van je slimme meter of aangeleverde data. Je krijgt direct inzicht in besparingspotentieel en beschikbare netcapaciteit. Resultaat binnen 5 werkdagen.',
      'Slimme Energie Rapport',
      'Uitgebreide on-site analyse met 2 weken meting op locatie. We brengen samen in kaart welke assets flexibel inzetbaar zijn om je energiekosten maximaal te verlagen. De hoogste mate van zekerheid.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">In de bijlage vind je alvast een voorbeeld van ons Energy &amp; Cost Savings rapport. Na onze analyse ontvang je een persoonlijk rapport voor <strong>' + (company || 'je bedrijf') + '</strong>, inclusief advies over zonnepanelen en batterijopslag.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Vragen? Neem gerust contact met me op.</p>'
  );
}

function buildDemoEmailNL(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Beste' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor je interesse in <strong>SAMBA.Energy</strong>! We hebben je aanvraag voor een demo van ons asset- en energiemanagement platform voor <strong>' + (company || 'je bedrijf') + '</strong> in goede orde ontvangen. Wij nemen zo snel mogelijk contact met je op om een datum en tijdstip in te plannen.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Alvast twee opties om over na te denken:</p>' +
    serviceBlocks(
      'Online via video call',
      'Snel en efficiënt. Ideaal voor een eerste indruk van het <strong>SAMBA.Energy</strong> asset- en energiemanagement platform en de besparingsmogelijkheden in de specifieke situatie van <strong>' + (company || 'je bedrijf') + '</strong>.',
      'Fysiek op locatie',
      'Voor een uitgebreidere kennismaking en diepere duik in ons <strong>SAMBA.Energy</strong> asset- en energiemanagement platform en de flex asset optimalisatie kansen voor <strong>' + (company || 'je bedrijf') + '</strong>. We kunnen dan ook direct de situatie ter plekke bekijken en de beste aanpak toetsen.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">De demo duurt ongeveer 30–60 minuten. Dan kijken we samen hoe <strong>SAMBA.Energy</strong> ervoor zorgt dat de flexibele assets van <strong>' + (company || 'je bedrijf') + '</strong> optimaal benut worden. Heb je vooraf al specifieke vragen of wensen voor de demo? Laat het gerust weten via een reply op deze mail.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">We spreken elkaar snel!</p>'
  );
}

function buildAnalysisEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Dear' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We have received your energy scan request for <strong>' + (company || 'your company') + '</strong>. We will get in touch as soon as possible to discuss your situation and the best approach.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Two options to consider:</p>' +
    serviceBlocks(
      'Smart Energy Check',
      'Quick analysis based on your smart meter or shared data. Immediate insight into savings potential and available grid capacity. Result within 5 working days.',
      'Smart Energy Report',
      'Comprehensive on-site analysis with 2 weeks of on-site measurement. Together we map out which assets can be used flexibly to maximally reduce your energy costs. The highest level of certainty.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Attached you will find a sample of our Energy &amp; Cost Savings report. After our analysis, you will receive a personalised report for <strong>' + (company || 'your company') + '</strong>, including advice on solar panels and battery storage.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Questions? Feel free to reach out.</p>',
    'en'
  );
}

function buildDemoEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#111111;line-height:1.7;margin:0 0 20px;">Dear' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in <strong>SAMBA.Energy</strong>! We have received your demo request for <strong>' + (company || 'your company') + '</strong> for our asset and energy management platform. We will contact you as soon as possible to schedule a date and time.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Two options to consider:</p>' +
    serviceBlocks(
      'Online via video call',
      'Quick and efficient. Ideal for a first impression of the <strong>SAMBA.Energy</strong> asset and energy management platform and the savings potential specific to <strong>' + (company || 'your company') + '</strong>.',
      'On location',
      'For a more in-depth introduction and a closer look at our <strong>SAMBA.Energy</strong> platform and flexible asset optimisation opportunities for <strong>' + (company || 'your company') + '</strong>. We can also take a direct look at the situation on-site and assess the best approach together.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">The demo takes approximately 30–60 minutes. Together we\'ll explore how <strong>SAMBA.Energy</strong> ensures the flexible assets of <strong>' + (company || 'your company') + '</strong> are used to their full potential. Do you have specific questions or wishes for the demo? Feel free to let us know in a reply to this email.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Talk soon!</p>',
    'en'
  );
}

function doGet(e) {
  return ContentService.createTextOutput('SAMBA Email Handler Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
