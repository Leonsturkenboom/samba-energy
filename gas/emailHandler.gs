var SENDER_NAME = 'SAMBA.Energy';
var NOTIFY_EMAIL = 'leon@samba.energy';
var NOTIFY_CC = 'andy@samba.energy';
var PDF_URL = 'https://samba.energy/rapport-voorbeeld.pdf';
var SIGNATURE_HTML =
  '<div style="margin-top:28px;padding-top:20px;border-top:1px solid #e8e8e8;font-family:monospace;font-size:13px;color:#333;">' +
  '<p style="margin:0 0 4px;">Met vriendelijke groet,</p>' +
  '<p style="margin:0 0 16px;font-weight:600;">Leon Sturkenboom</p>' +
  '<table cellpadding="0" cellspacing="0" style="margin-bottom:12px;"><tr>' +
  '<td style="padding-right:14px;vertical-align:middle;">' +
  '<a href="https://samba.energy"><img src="https://samba.energy/images/samba-logo-email.png" width="72" alt="SAMBA.Energy" style="display:block;"></a>' +
  '</td>' +
  '<td style="vertical-align:middle;">' +
  '<span style="font-weight:700;font-size:14px;">SAMBA.Energy</span><br>' +
  '<span style="color:#555;font-size:12px;">Ritme in je assets,<br>Grip op de zaak</span>' +
  '</td></tr></table>' +
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

  // isAnalysis: true for savings request, false for demo
  var isAnalysis = type.toLowerCase().indexOf('demo') === -1;
  var isEN = lang === 'en';

  // 1. Notificatiemail naar SAMBA team
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
    type + ' — ' + companyName,
    notificationBody,
    { cc: NOTIFY_CC, name: SENDER_NAME }
  );

  // 2. Bevestigingsmail naar aanvrager
  if (email) {
    var subject, htmlBody;

    if (isEN) {
      subject = isAnalysis ? 'Your request at SAMBA.Energy' : 'Confirmation: your SAMBA demo request';
      htmlBody = isAnalysis
        ? buildAnalysisEmailEN(contactPerson, companyName)
        : buildDemoEmailEN(contactPerson, companyName);
    } else {
      subject = isAnalysis ? 'Uw aanvraag bij SAMBA.Energy' : 'Bevestiging: uw SAMBA demo aanvraag';
      htmlBody = isAnalysis
        ? buildAnalysisEmailNL(contactPerson, companyName)
        : buildDemoEmailNL(contactPerson, companyName);
    }

    if (isAnalysis) {
      var pdfBlob = UrlFetchApp.fetch(PDF_URL).getBlob();
      pdfBlob.setName('Voorbeeld_Rapport_SAMBA.Energy.pdf');
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
    '<tr><td style="background:#111111;border-radius:16px 16px 0 0;padding:28px 36px;">' +
    '<span style="font-size:18px;font-weight:700;color:#E8F53A;letter-spacing:0.08em;">SAMBA.Energy</span></td></tr>' +
    '<tr><td style="background:#ffffff;padding:40px 36px;">' +
    body +
    SIGNATURE_HTML +
    '</td></tr>' +
    '<tr><td style="background:#f0f0f0;border-radius:0 0 16px 16px;padding:16px 36px;border-top:1px solid #e0e0e0;">' +
    '<p style="font-size:11px;color:#aaaaaa;margin:0;">SAMBA.Energy &mdash; Smart Asset Management &amp; Business Automation</p>' +
    '</td></tr></table></td></tr></table></body></html>';
}

function buildAnalysisEmailNL(name, company) {
  return emailWrapper(
    '<h1 style="font-size:24px;font-weight:700;color:#111111;margin:0 0 16px;">Bedankt voor uw aanvraag' + (name ? ', ' + name : '') + '!</h1>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We hebben uw aanvraag voor <strong>' + (company || 'uw bedrijf') + '</strong> ontvangen. Wij nemen zo snel mogelijk contact met je op om de situatie en de gewenste aanpak te bespreken. We hebben twee opties om over na te denken:</p>' +
    '<p style="font-size:15px;color:#111111;font-weight:700;margin:0 0 4px;">Slimme energie check</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 16px;">Met deze snelle analyse krijgt u direct inzicht in hoe u kunt besparen op uw energierekening &eacute;n hoeveel ruimte er nog is op uw netaansluiting dankzij de slimme sturing van SAMBA.Energy. Resultaat binnen 5 werkdagen.</p>' +
    '<p style="font-size:15px;color:#111111;font-weight:700;margin:0 0 4px;">Slimme energie rapport</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Een uitgebreide, on-site scan waarin we samen in kaart brengen welke apparaten we kunnen inzetten als flexibele assets om uw energiekosten maximaal te verlagen. Hiervoor voeren we een meting uit op locatie. Dit traject duurt minstens 2 weken, maar biedt wel de hoogste mate van zekerheid.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">In de bijlage vindt u alvast een voorbeeld van ons Energy &amp; Cost Savings rapport, zodat u een indruk krijgt van wat u kunt verwachten. Na onze analyse ontvangt u een persoonlijk rapport op basis van uw eigen situatie, inclusief de optimalisatiemogelijkheden in combinatie met de inzet van (extra) zonnepanelen en een batterij.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Heeft u nu al vragen? Neem dan gerust contact met mij op.</p>'
  );
}

function buildDemoEmailNL(name, company) {
  return emailWrapper(
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 6px;">Beste' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Bedankt voor uw interesse in SAMBA.Energy! We hebben uw aanvraag voor een demo van ons platform voor <strong>' + (company || 'uw bedrijf') + '</strong> in goede orde ontvangen.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Wij nemen zo snel mogelijk contact met u op om een datum en tijdstip in te plannen. Zo kunnen we samen kijken hoe we uw energie-assets optimaal kunnen gaan benutten.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">De demo duurt ongeveer 30&ndash;45 minuten en kan op twee manieren plaatsvinden:</p>' +
    '<ul style="font-size:15px;color:#444444;line-height:1.9;margin:0 0 20px;padding-left:20px;">' +
    '<li><strong>Online via een videocall</strong> &mdash; lekker snel en effici&euml;nt.</li>' +
    '<li><strong>Op locatie</strong> &mdash; dan kunnen we direct even de situatie bekijken.</li>' +
    '</ul>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Heeft u vooraf al specifieke vragen of wensen die u tijdens de demo wilt behandelen? Laat het gerust weten in een reactie op deze mail.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Tot snel!</p>'
  );
}

function buildAnalysisEmailEN(name, company) {
  return emailWrapper(
    '<h1 style="font-size:24px;font-weight:700;color:#111111;margin:0 0 16px;">Thank you for your request' + (name ? ', ' + name : '') + '!</h1>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We have received your request for <strong>' + (company || 'your company') + '</strong>. We will contact you as soon as possible to discuss your situation and the best approach. We have two options to consider:</p>' +
    '<p style="font-size:15px;color:#111111;font-weight:700;margin:0 0 4px;">Smart energy check</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 16px;">With this quick analysis, you will get immediate insight into how you can save on your energy bill and how much capacity is still available on your grid connection thanks to SAMBA.Energy&apos;s smart control. Result within 5 working days.</p>' +
    '<p style="font-size:15px;color:#111111;font-weight:700;margin:0 0 4px;">Smart energy report</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">A comprehensive, on-site scan in which we map out together which devices can be used as flexible assets to maximally reduce your energy costs. We carry out a measurement on location. This process takes at least 2 weeks, but offers the highest level of certainty.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">In the attachment you will find a sample of our Energy &amp; Cost Savings report, so you can get an impression of what to expect. After our analysis, you will receive a personal report based on your own situation, including optimisation possibilities with (additional) solar panels and a battery.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Do you have questions already? Please feel free to contact me.</p>'
  );
}

function buildDemoEmailEN(name, company) {
  return emailWrapper(
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 6px;">Dear' + (name ? ' ' + name : '') + ',</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Thank you for your interest in SAMBA.Energy! We have received your demo request for <strong>' + (company || 'your company') + '</strong>.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">We will contact you as soon as possible to schedule a date and time. Together we can explore how to optimally utilise your energy assets.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 10px;">The demo takes approximately 30&ndash;45 minutes and can take place in two ways:</p>' +
    '<ul style="font-size:15px;color:#444444;line-height:1.9;margin:0 0 20px;padding-left:20px;">' +
    '<li><strong>Online via video call</strong> &mdash; quick and efficient.</li>' +
    '<li><strong>On location</strong> &mdash; then we can take a direct look at the situation.</li>' +
    '</ul>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 20px;">Do you have specific questions or wishes for the demo? Feel free to let us know in a reply to this email.</p>' +
    '<p style="font-size:15px;color:#444444;line-height:1.7;margin:0 0 28px;">Talk soon!</p>'
  );
}

function doGet(e) {
  return ContentService.createTextOutput('SAMBA Email Handler Active')
    .setMimeType(ContentService.MimeType.TEXT);
}
