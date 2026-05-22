var SENDER_NAME = 'SAMBA.Energy';
var NOTIFY_EMAIL = 'leon@samba.energy';
var NOTIFY_CC = 'andy@samba.energy';
var PDF_URL = 'https://samba.energy/rapport-voorbeeld.pdf';

var SIGNATURE_HTML =
  '<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e8e8e8;">' +
  '<p style="margin:0 0 2px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:13px;color:#555;">Met vriendelijke groet,</p>' +
  '<p style="margin:0 0 0;line-height:10px;font-size:10px;">&nbsp;</p>' +
  '<p style="margin:0 0 18px;font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;font-weight:700;color:#111111;">Leon Sturkenboom</p>' +
  '<a href="https://samba.energy" style="display:inline-block;margin-bottom:14px;">' +
  '<img src="https://samba.energy/images/samba-logo-email.png" width="180" alt="SAMBA.Energy" style="display:block;">' +
  '</a>' +
  '<p style="margin:0;font-family:\'Courier New\',Courier,monospace;font-size:12px;color:#555;">' +
  '<a href="https://samba.energy" style="color:#2563eb;text-decoration:none;">www.SAMBA.energy</a> /// 06 46444468</p>' +
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

function emailWrapper(body) {
  return '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1.0">' +
    '</head>' +
    '<body style="margin:0;padding:0;background:#f5f5f5;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 0;">' +
    '<tr><td align="center">' +
    '<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">' +
    // Header — geen ronding
    '<tr><td style="background:#111111;padding:16px 28px;">' +
    '<table width="100%" cellpadding="0" cellspacing="0"><tr>' +
    '<td style="vertical-align:middle;white-space:nowrap;padding-right:14px;">' +
    '<span style="font-family:\'Courier New\',Courier,monospace;font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.14em;">SAMBA.Energy</span>' +
    '</td>' +
    '<td style="vertical-align:middle;overflow:hidden;width:100%;">' +
    '<span style="font-family:\'Courier New\',Courier,monospace;font-size:12px;color:#E8F53A;font-weight:600;letter-spacing:0.2em;white-space:nowrap;">/ / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /</span>' +
    '</td>' +
    '<td style="vertical-align:middle;padding-left:14px;width:30px;">' +
    '<img src="https://samba.energy/Logo%20SAMBA.svg" width="26" height="26" alt="" style="display:block;margin-left:auto;">' +
    '</td>' +
    '</tr></table>' +
    '</td></tr>' +
    // Body
    '<tr><td style="background:#ffffff;padding:36px 36px 40px;">' +
    body +
    SIGNATURE_HTML +
    '</td></tr>' +
    // Footer met dashes tot einde
    '<tr><td style="background:#f2f2f2;padding:14px 28px;border-top:1px solid #e4e4e4;overflow:hidden;">' +
    '<p style="font-size:11px;color:#aaaaaa;margin:0;font-family:\'Courier New\',Courier,monospace;letter-spacing:0.06em;white-space:nowrap;overflow:hidden;">SAMBA.Energy /// Smart Asset Management &amp; Business Automation / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /</p>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr></table></body></html>';
}

function serviceBlocks(block1Title, block1Body, block2Title, block2Body) {
  return '<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">' +
    '<tr><td style="border-left:3px solid #E8F53A;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-family:\'Courier New\',Courier,monospace;font-size:11px;font-weight:700;color:#111111;margin:0 0 5px;letter-spacing:0.1em;text-transform:uppercase;">' + block1Title + '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;color:#555555;line-height:1.65;margin:0;">' + block1Body + '</p>' +
    '</td></tr>' +
    '<tr><td style="height:12px;"></td></tr>' +
    '<tr><td style="border-left:3px solid #E8F53A;padding:10px 0 10px 16px;vertical-align:top;">' +
    '<p style="font-family:\'Courier New\',Courier,monospace;font-size:11px;font-weight:700;color:#111111;margin:0 0 5px;letter-spacing:0.1em;text-transform:uppercase;">' + block2Title + '</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:14px;color:#555555;line-height:1.65;margin:0;">' + block2Body + '</p>' +
    '</td></tr>' +
    '</table>';
}

function buildAnalysisEmailNL(name, company) {
  return emailWrapper(
    '<h1 style="font-family:\'Courier New\',Courier,monospace;font-size:20px;font-weight:700;color:#111111;margin:0 0 16px;letter-spacing:0.02em;">Bedankt voor je aanvraag' + (name ? ', ' + name : '') + '.</h1>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We hebben je aanvraag voor <strong>' + (company || 'je bedrijf') + '</strong> ontvangen. Wij nemen zo snel mogelijk contact met je op om de situatie en de gewenste aanpak te bespreken.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Twee opties om over na te denken:</p>' +
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
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Beste' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor je interesse in SAMBA.Energy. We hebben je demoaanvraag voor <strong>' + (company || 'je bedrijf') + '</strong> ontvangen.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Wij nemen zo snel mogelijk contact met je op om een datum en tijdstip in te plannen. Dan kijken we samen hoe SAMBA.Energy je energie-assets optimaal kan benutten.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">De demo duurt ongeveer 30&ndash;45 minuten en kan op twee manieren:</p>' +
    '<ul style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.9;margin:0 0 28px;padding-left:20px;">' +
    '<li><strong>Online via videocall</strong> &mdash; snel en effici&euml;nt.</li>' +
    '<li><strong>Op locatie</strong> &mdash; dan kunnen we direct de situatie bekijken.</li>' +
    '</ul>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Specifieke vragen of wensen voor de demo? Laat het gerust weten via een reply op deze mail.</p>'
  );
}

function buildAnalysisEmailEN(name, company) {
  return emailWrapper(
    '<h1 style="font-family:\'Courier New\',Courier,monospace;font-size:20px;font-weight:700;color:#111111;margin:0 0 16px;letter-spacing:0.02em;">Thanks for your request' + (name ? ', ' + name : '') + '.</h1>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We have received your request for <strong>' + (company || 'your company') + '</strong>. We will get in touch as soon as possible to discuss your situation and the best approach.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 14px;">Two options to consider:</p>' +
    serviceBlocks(
      'Smart Energy Check',
      'Quick analysis based on your smart meter or shared data. Immediate insight into savings potential and available grid capacity. Result within 5 working days.',
      'Smart Energy Report',
      'Comprehensive on-site analysis with 2 weeks of measurement on location. Together we map out which assets can be used flexibly to maximally reduce your energy costs. The highest level of certainty.'
    ) +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Attached you will find a sample of our Energy &amp; Cost Savings report. After our analysis, you will receive a personal report for <strong>' + (company || 'your company') + '</strong>, including advice on solar panels and battery storage.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Questions? Feel free to reach out.</p>'
  );
}

function buildDemoEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Dear' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in SAMBA.Energy. We have received your demo request for <strong>' + (company || 'your company') + '</strong>.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We will contact you as soon as possible to schedule a date and time. Together we will explore how SAMBA.Energy can optimally utilise your energy assets.</p>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">The demo takes approximately 30&ndash;45 minutes and can take place in two ways:</p>' +
    '<ul style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.9;margin:0 0 28px;padding-left:20px;">' +
    '<li><strong>Online via video call</strong> &mdash; quick and efficient.</li>' +
    '<li><strong>On location</strong> &mdash; then we can take a direct look at the situation.</li>' +
    '</ul>' +
    '<p style="font-family:\'Helvetica Neue\',Helvetica,Arial,sans-serif;font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Specific questions or wishes for the demo? Feel free to let us know in a reply to this email.</p>'
  );
}

function doGet(e) {
  return ContentService.createTextOutput('SAMBA Email Handler Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
