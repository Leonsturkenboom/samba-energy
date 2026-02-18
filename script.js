/* ========================================
   SAMBA - Interactive Features
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initSmoothScroll();
    initMobileMenu();
    initLanguageToggle();
    initSlashBackground();
    initScrollAnimations();
    initFlexibleTabs();
    initCharts();
    initContactForm();
    initHeartbeatRepeat();
    initDashesStop();
    initGlobe();
    initSmartCardHover();
    initAssetCardHover();
    initCookieBanner();
});

/* ----------------------------------------
   Navbar Scroll Effect
   ---------------------------------------- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ----------------------------------------
   Smooth Scroll for Anchor Links
   ---------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const navHeight = document.getElementById('navbar').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });

                // Close mobile menu if open
                document.querySelector('.nav-links')?.classList.remove('active');
            }
        });
    });
}

/* ----------------------------------------
   Mobile Menu Toggle
   ---------------------------------------- */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    btn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

/* ----------------------------------------
   Cookie Banner
   ---------------------------------------- */
function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('cookieAccept');
    const declineBtn = document.getElementById('cookieDecline');

    // Check if user already responded
    if (localStorage.getItem('cookieConsent')) {
        banner.classList.add('hidden');
        return;
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        banner.classList.add('hidden');
    });

    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        banner.classList.add('hidden');
    });
}

/* ----------------------------------------
   Language Toggle (EN/NL)
   ---------------------------------------- */
const translations = {
    en: {
        'nav.smart': 'Smart',
        'nav.flexible': 'Flexible',
        'nav.assets': 'Assets',
        'nav.success': 'Success',
        'hero.line1': 'Rhythm in your assets,',
        'hero.line2': 'Grip on your business',
        'hero.cta1': 'Book a demo',
        'hero.cta2': 'Request savings analysis',
        'smart.title': 'SMART',
        'smart.subtitle': 'One complete platform for asset management & automation',
        'smart.card1.title': 'Save costs',
        'smart.card1.desc': 'Save with dynamic energy prices or simply by increasing the use of your own solar panels.',
        'smart.card2.title': 'AI forecasting',
        'smart.card2.desc': 'To plan the use of your assets per day and per week, we use AI forecasting algorithms.',
        'smart.card3.title': 'Simple',
        'smart.card3.desc': 'All your asset management from one app. Implementation fully taken care of with ongoing support.',
        'smart.card4.title': 'Safe',
        'smart.card4.desc': 'Local control and data storage. Fully self-managed, stays operational during internet or power outages and is digitally secured.',
        'flexible.title': 'FLEXIBLE',
        'flexible.subtitle': 'Synchronises your energy use with solar and dynamic energy prices and maintains your energy use below the maximum of the grid connection',
        'flexible.tab1': 'Cost savings',
        'flexible.tab2': 'Grid Limit',
        'flexible.cost.title': 'Save costs with smart timing',
        'flexible.cost.without': 'Without SAMBA',
        'flexible.cost.without.desc': 'Consumption is not aligned with solar generation or low dynamic energy prices. A lot of energy is purchased when prices are high.',
        'flexible.cost.with': 'With SAMBA',
        'flexible.cost.with.desc': 'Consumption follows solar generation or when grid prices are low. This saves you significant costs.',
        'flexible.grid.title': 'Stay within your grid capacity',
        'flexible.grid.without': 'Without SAMBA',
        'flexible.grid.without.desc': 'Consumption regularly exceeds the grid limit. This leads to fines and higher costs for your grid connection.',
        'flexible.grid.with': 'With SAMBA',
        'flexible.grid.with.desc': 'Automatically keeps your consumption below the grid limit. Thereby avoid fines and save significantly on your grid connection.',
        'assets.title': 'ASSETS',
        'assets.subtitle': 'Energy & Asset management has never been this affordable and simple',
        'assets.card1.title': 'Charging park',
        'assets.card1.desc': 'Save up to \u20AC700 per charging point per year by automatically aligning charging moments with dynamic energy prices and solar generation. SAMBA charges your fleet at the cheapest moment, monitors your grid limit and supports load balancing and bidirectional charging.',
        'assets.card2.title': 'Solar panels',
        'assets.card2.desc': 'Maximize the use of your own solar generation. SAMBA monitors real-time energy flow between your solar system, grid connection and assets, and automatically controls assets during solar hours.',
        'assets.card3.title': 'Battery system',
        'assets.card3.desc': 'Focus on optimizing your own consumption. SAMBA first controls your flexible assets during cheap and green moments, reducing your required battery capacity by 50\u201370%.',
        'assets.card4.title': 'Other flex assets',
        'assets.card4.desc': 'From boiler tanks, heat pumps, cold storage, chillers, air conditioning to forklift charging. SAMBA monitors and controls the energy consumption of all your flexible assets. Save up to 40% on your energy consumption.',
        'assets.card5.title': 'Ventilation',
        'assets.card5.desc': 'Save up to 20% on ventilation by planning capacity based on air quality, CO\u2082 levels and occupancy. SAMBA ensures a healthy indoor climate only when needed.',
        'assets.card6.title': 'Lighting',
        'assets.card6.desc': 'Reduce lighting-related energy consumption through automatic control based on presence, schedule or outdoor light.',
        'assets.card7.title': 'Security',
        'assets.card7.desc': 'Combine asset management with securing your premises. SAMBA can be used in many ways to secure your building.',
        'success.title': 'SUCCESS',
        'success.subtitle': 'Discover how we helped other companies',
        'success.quote1': '"Since using SAMBA we utilize 85% of our own solar generation. The savings are impressive."',
        'success.role1': 'Director, GreenBuildings BV',
        'success.quote2': '"The system works fully autonomously. Even during internet outages everything keeps running. Exactly what we were looking for."',
        'success.role2': 'Facility Manager, TechnoFlex Industries',
        'success.quote3': '"Thanks to SAMBA we stay below our grid limit and avoid high fines. It paid for itself in 6 months."',
        'success.role3': 'CEO, EcoLogistics',
        'request.title': 'REQUEST',
        'request.subtitle': 'Discover your savings potential with SAMBA. We analyse your situation and provide personal advice. Or book a demo directly.',
        'request.company': 'Company name *',
        'request.contact': 'Contact person *',
        'request.email': 'Email address *',
        'request.phone': 'Phone number',
        'request.situation': 'Your situation (optional)',
        'request.cta.demo': 'Book a demo',
        'request.cta.analysis': 'Request analysis',
        'request.note': 'Completely without obligation, we are happy to discuss all possibilities.',
        'request.success.title': 'Thank you!',
        'request.success.text': 'We have received your request and will contact you as soon as possible.',
        'request.placeholder.company': 'Your company name',
        'request.placeholder.contact': 'Your name',
        'request.placeholder.email': 'email@company.com',
        'request.placeholder.phone': '+31 6 12345678',
        'request.placeholder.situation': 'Tell us about your current energy situation, equipment, or specific requirements...',
        'cookie.text': 'This website uses cookies to improve your experience. By continuing you agree to our cookie policy.',
        'cookie.accept': 'Accept',
        'cookie.decline': 'Decline',
        'footer.smart': 'SMART',
        'footer.flexible': 'FLEXIBLE',
        'footer.assets': 'ASSETS',
        'footer.success': 'SUCCESS',
        'footer.request': 'REQUEST',
        'footer.contact': 'CONTACT',
        'marquee': 'SMART ASSET MANAGEMENT & BUSINESS AUTOMATION'
    },
    nl: {
        'nav.smart': 'SLIM',
        'nav.flexible': 'FLEXIBEL',
        'nav.assets': 'ASSETS',
        'nav.success': 'SUCCES',
        'hero.line1': 'Ritme in je assets,',
        'hero.line2': 'Grip op de zaak',
        'hero.cta1': 'Demo aanvragen',
        'hero.cta2': 'Besparingsanalyse aanvragen',
        'smart.title': 'SLIM',
        'smart.subtitle': 'Een compleet platform voor asset management & automatisering',
        'smart.card1.title': 'Kosten besparen',
        'smart.card1.desc': 'Bespaar in combinatie met dynamische energieprijzen of gewoon door hoger gebruik van je eigen zonnepanelen.',
        'smart.card2.title': 'AI forecasting',
        'smart.card2.desc': 'Om per dag en per week het gebruik van je assets te plannen, maken we gebruik van AI forecasting algoritmen.',
        'smart.card3.title': 'Simpel',
        'smart.card3.desc': 'Al je asset-beheer vanuit \u00e9\u00e9n app. Implementatie volledig verzorgd en met doorlopende ondersteuning.',
        'smart.card4.title': 'Veilig',
        'smart.card4.desc': 'Lokale aansturing en dataopslag. Werkt volledig in eigen beheer, blijft operationeel bij internet of stroom uitval en is digitaal veilig afgeschermd.',
        'flexible.title': 'FLEXIBEL',
        'flexible.subtitle': 'Synchroniseert je energieverbruik met zonne-energie en dynamische energieprijzen en houdt je verbruik onder het maximum van de netaansluiting',
        'flexible.tab1': 'Kostenbesparing',
        'flexible.tab2': 'Netlimiet',
        'flexible.cost.title': 'Bespaar kosten met slim timen',
        'flexible.cost.without': 'Zonder SAMBA',
        'flexible.cost.without.desc': 'Verbruik is niet afgestemd op zonne-opwek of lage dynamische energieprijzen. Veel energie wordt ingekocht wanneer de prijs hoog is.',
        'flexible.cost.with': 'Met SAMBA',
        'flexible.cost.with.desc': 'Verbruik volgt de zonne-opwek of wanneer prijzen laag zijn vanuit het net. Hierdoor bespaar je significant kosten.',
        'flexible.grid.title': 'Blijf binnen je netcapaciteit',
        'flexible.grid.without': 'Zonder SAMBA',
        'flexible.grid.without.desc': 'Verbruik overschrijdt regelmatig de netlimiet. Dit leidt tot boetes en hogere kosten voor je netaansluiting.',
        'flexible.grid.with': 'Met SAMBA',
        'flexible.grid.with.desc': 'Houdt automatisch je verbruik onder de netlimiet. Voorkom daarmee boetes en bespaar significant op je netaansluiting.',
        'assets.title': 'ASSETS',
        'assets.subtitle': 'Energie & Asset management was nog nooit zo goedkoop en simpel',
        'assets.card1.title': 'Laadpark',
        'assets.card1.desc': 'Bespaar tot wel \u20AC700 per laadpunt per jaar door laadmomenten automatisch af te stemmen op dynamische energieprijzen en zonne-opwek. SAMBA laadt je wagenpark op het goedkoopste moment, bewaakt je netlimiet en ondersteunt loadbalancing en bidirectioneel laden.',
        'assets.card2.title': 'Zonnepanelen',
        'assets.card2.desc': 'Maximaliseer het gebruik van eigen zonne-opwek. SAMBA monitort realtime de energieflow tussen je zonnesysteem, netaansluiting en je assets, en stuurt assets automatisch aan op zonne-uren.',
        'assets.card3.title': 'Batterijsysteem',
        'assets.card3.desc': 'Focus op het optimaliseren van je eigen verbruik. SAMBA stuurt eerst je flexibele assets aan op goedkope en groene momenten, waardoor je 50\u201370% minder batterijcapaciteit nodig hebt.',
        'assets.card4.title': 'Andere flex assets',
        'assets.card4.desc': 'Van boilervaten, warmtepompen, koelcellen, chillers, aircos tot het laden van vorkheftrucks. SAMBA monitort en controleert het energieverbruik van al je flexibele assets. Bespaar daarmee tot wel 40% op je energieverbruik.',
        'assets.card5.title': 'Ventilatie',
        'assets.card5.desc': 'Bespaar tot 20% op ventilatie door capaciteit te plannen op basis van luchtkwaliteit, CO\u2082-niveaus en bezetting. SAMBA zorgt voor een gezond binnenklimaat alleen wanneer dat nodig is.',
        'assets.card6.title': 'Verlichting',
        'assets.card6.desc': 'Verlaag verlichting-gerelateerd energieverbruik door automatische sturing afgestemd op aanwezigheid, tijdschema of licht buiten.',
        'assets.card7.title': 'Beveiliging',
        'assets.card7.desc': 'Combineer asset management samen met het beveiligen van je pand. SAMBA kan op tal van manieren worden gebruikt om je pand te beveiligen.',
        'success.title': 'SUCCES',
        'success.subtitle': 'Ontdek hoe we andere bedrijven hebben geholpen',
        'success.quote1': '"Sinds SAMBA benutten we 85% van onze eigen zonneopwek. De besparingen zijn indrukwekkend."',
        'success.role1': 'Directeur, GreenBuildings BV',
        'success.quote2': '"Het systeem werkt volledig autonoom. Zelfs bij internet uitval blijft alles draaien. Precies wat we zochten."',
        'success.role2': 'Facility Manager, TechnoFlex Industries',
        'success.quote3': '"Dankzij SAMBA blijven we onder onze netlimiet en voorkomen we hoge boetes. Het heeft zichzelf in 6 maanden terugverdiend."',
        'success.role3': 'CEO, EcoLogistics',
        'request.title': 'VRAAG AAN',
        'request.subtitle': 'Ontdek je besparingspotentieel met SAMBA. Wij analyseren jouw situatie en geven persoonlijk advies. Of plan direct een demo.',
        'request.company': 'Bedrijfsnaam *',
        'request.contact': 'Contactpersoon *',
        'request.email': 'E-mailadres *',
        'request.phone': 'Telefoonnummer',
        'request.situation': 'Uw situatie (optioneel)',
        'request.cta.demo': 'Demo aanvragen',
        'request.cta.analysis': 'Analyse aanvragen',
        'request.note': 'Geheel vrijblijvend bespreken we graag alle mogelijkheden door.',
        'request.success.title': 'Bedankt!',
        'request.success.text': 'We hebben je aanvraag ontvangen en nemen zo snel mogelijk contact met je op.',
        'request.placeholder.company': 'Uw bedrijfsnaam',
        'request.placeholder.contact': 'Uw naam',
        'request.placeholder.email': 'email@bedrijf.nl',
        'request.placeholder.phone': '06 12345678',
        'request.placeholder.situation': 'Vertel ons over uw huidige energiesituatie, apparaten, of specifieke wensen...',
        'cookie.text': 'Deze website gebruikt cookies om je ervaring te verbeteren. Door verder te gaan ga je akkoord met ons cookiebeleid.',
        'cookie.accept': 'Accepteren',
        'cookie.decline': 'Weigeren',
        'footer.smart': 'SLIM',
        'footer.flexible': 'FLEXIBEL',
        'footer.assets': 'ASSETS',
        'footer.success': 'SUCCES',
        'footer.request': 'AANVRAAG',
        'footer.contact': 'CONTACT',
        'marquee': 'SLIMME ASSET MANAGEMENT & BEDRIJFS AUTOMATISERING'
    }
};

let currentLang = 'nl';

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    // Update footer slogan with line break
    const sloganEl = document.querySelector('.footer-slogan');
    if (sloganEl) {
        const sloganTexts = {
            en: 'Rhythm in your assets,<br>Grip on your business',
            nl: 'Ritme in je assets,<br>Grip op de zaak'
        };
        sloganEl.innerHTML = sloganTexts[currentLang];
    }

    // Update marquee text
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        const text = translations[currentLang]['marquee'];
        const marqueeText = (text + ' / ').repeat(4);
        const spans = marqueeContent.querySelectorAll('span');
        spans.forEach(span => {
            span.textContent = marqueeText;
        });
    }
}

function initLanguageToggle() {
    const btn = document.getElementById('langToggle');
    // Set initial button text (default is NL)
    btn.textContent = 'NL';

    btn.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'nl' : 'en';
        btn.textContent = currentLang === 'en' ? 'ENG' : 'NL';
        document.documentElement.lang = currentLang;
        applyTranslations();
    });
}

/* ----------------------------------------
   Slash Background (Hero hover effect)
   ---------------------------------------- */
function initSlashBackground() {
    const container = document.getElementById('slashBg');
    for (let i = 0; i < 20; i++) {
        const slash = document.createElement('span');
        slash.className = 'slash-char';
        slash.textContent = '/';
        slash.style.top = Math.random() * 100 + '%';
        slash.style.left = '-100px';
        slash.style.fontSize = (16 + Math.random() * 40) + 'px';
        slash.style.animationDuration = (15 + Math.random() * 20) + 's';
        slash.style.animationDelay = (Math.random() * 8) + 's';
        slash.style.opacity = (0.02 + Math.random() * 0.06);
        container.appendChild(slash);
    }
}

/* ----------------------------------------
   Scroll-triggered Reveal Animations
   ---------------------------------------- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

/* ----------------------------------------
   Smart Card Hover - only expand hovered card
   ---------------------------------------- */
function initSmartCardHover() {
    const cards = document.querySelectorAll('.smart-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('expanded');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('expanded');
        });
    });
}

/* ----------------------------------------
   Asset Card Hover / Tap + Seamless Carousel
   Desktop: hover to expand, auto-scroll
   Mobile: tap to toggle, swipe to scroll, no auto-scroll
   ---------------------------------------- */
function initAssetCardHover() {
    const carousel = document.getElementById('assetsCarousel');
    if (!carousel) return;

    const isTouchDevice = () => window.matchMedia('(max-width: 1024px)').matches || 'ontouchstart' in window;

    // Ensure we have enough clones for seamless scrolling (3x original set)
    const cardCount = 7;
    const originals = Array.from(carousel.querySelectorAll('.asset-card')).slice(0, cardCount);
    const allCards = Array.from(carousel.querySelectorAll('.asset-card'));
    allCards.slice(cardCount).forEach(c => c.remove());
    // Clone 3 extra sets for seamless infinite scroll
    for (let i = 0; i < 3; i++) {
        originals.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });
    }

    function bindCardInteractions() {
        const cards = carousel.querySelectorAll('.asset-card');
        cards.forEach(card => {
            // Desktop hover
            card.addEventListener('mouseenter', () => {
                if (!isTouchDevice()) card.classList.add('expanded');
            });
            card.addEventListener('mouseleave', () => {
                if (!isTouchDevice()) card.classList.remove('expanded');
            });
            // Mobile tap to toggle
            card.addEventListener('click', (e) => {
                if (!isTouchDevice()) return;
                e.preventDefault();
                e.stopPropagation();
                const wasExpanded = card.classList.contains('expanded');
                // Close all expanded cards
                cards.forEach(c => c.classList.remove('expanded'));
                // Toggle clicked card
                if (!wasExpanded) {
                    card.classList.add('expanded');
                    // Stop carousel animation when card is open
                    carousel.style.animationPlayState = 'paused';
                }
            });
        });
    }
    bindCardInteractions();

    // --- Touch swipe for mobile/iPad ---
    let touchStartX = 0;
    let touchCurrentX = 0;
    let isDragging = false;
    let startScrollLeft = 0;

    const wrapper = carousel.parentElement;

    wrapper.addEventListener('touchstart', (e) => {
        if (!isTouchDevice()) return;
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        carousel.style.animationPlayState = 'paused';
        // Get current transform position
        const style = window.getComputedStyle(carousel);
        const matrix = new DOMMatrix(style.transform);
        startScrollLeft = matrix.m41;
        carousel.style.animation = 'none';
        carousel.style.transform = `translateX(${startScrollLeft}px)`;
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging || !isTouchDevice()) return;
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;
        carousel.style.transform = `translateX(${startScrollLeft + diff}px)`;
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
        if (!isDragging || !isTouchDevice()) return;
        isDragging = false;
        // Keep the current position, don't restart animation on mobile
    });

    // On desktop, ensure animation runs
    function checkAnimationState() {
        if (!isTouchDevice()) {
            carousel.style.animation = '';
            carousel.style.transform = '';
            carousel.style.animationPlayState = '';
        }
    }
    window.addEventListener('resize', checkAnimationState);
}

/* ----------------------------------------
   Flexible Section Tabs
   ---------------------------------------- */
function initFlexibleTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tabId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById('tab-' + tabId).classList.add('active');

            // Resize ECharts on tab switch
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        });
    });
}

/* ----------------------------------------
   Charts (ECharts)
   ---------------------------------------- */
function initCharts() {
    const timeLabels = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const gridLabels = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'];

    const baseOption = {
        grid: { left: 50, right: 80, top: 20, bottom: 25 },
        tooltip: { show: false },
        legend: { show: false },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#999' },
            axisLine: { lineStyle: { color: '#eee' } },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            name: 'kW',
            nameLocation: 'middle',
            nameGap: 35,
            nameTextStyle: { fontFamily: 'JetBrains Mono', fontSize: 11, color: '#999' },
            min: 0,
            max: 80,
            axisLabel: { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#999' },
            splitLine: { lineStyle: { color: 'rgba(0,0,0,0.05)' } }
        }
    };

    // Store chart instances for resize
    const charts = [];

    // Inline label style helper
    const inlineLabel = (color) => ({
        show: true,
        position: 'end',
        formatter: '{a}',
        fontFamily: 'JetBrains Mono',
        fontSize: 9,
        color: color
    });

    // Chart: Without SAMBA (cost savings)
    const elWithout = document.getElementById('chartWithout');
    if (elWithout) {
        const chart = echarts.init(elWithout);
        chart.setOption({
            ...baseOption,
            xAxis: { ...baseOption.xAxis, data: timeLabels },
            series: [
                {
                    name: 'Zonne-opwek',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [5, 15, 40, 65, 70, 55, 25, 8],
                    lineStyle: { color: '#FFD54F' },
                    areaStyle: { color: 'rgba(255, 213, 79, 0.3)' },
                    itemStyle: { color: '#FFD54F' },
                    endLabel: inlineLabel('#FFD54F')
                },
                {
                    name: 'Verbruik',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [25, 35, 30, 20, 25, 35, 50, 45],
                    lineStyle: { color: '#E53935' },
                    areaStyle: { color: 'rgba(229, 57, 53, 0.2)' },
                    itemStyle: { color: '#E53935' },
                    endLabel: inlineLabel('#E53935')
                }
            ]
        });
        charts.push(chart);
    }

    // Chart: With SAMBA (cost savings)
    const elWith = document.getElementById('chartWith');
    if (elWith) {
        const chart = echarts.init(elWith);
        chart.setOption({
            ...baseOption,
            grid: { left: 50, right: 120, top: 20, bottom: 25 },
            xAxis: { ...baseOption.xAxis, data: timeLabels },
            series: [
                {
                    name: 'Zonne-opwek',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [5, 15, 40, 65, 70, 55, 25, 8],
                    lineStyle: { color: '#FFD54F' },
                    areaStyle: { color: 'rgba(255, 213, 79, 0.15)' },
                    itemStyle: { color: '#FFD54F' },
                    endLabel: inlineLabel('#FFD54F')
                },
                {
                    name: 'Verbruik',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [10, 18, 42, 68, 72, 50, 20, 12],
                    lineStyle: { color: '#43A047' },
                    areaStyle: { color: 'rgba(67, 160, 71, 0.3)' },
                    itemStyle: { color: '#43A047' },
                    endLabel: inlineLabel('#43A047')
                }
            ]
        });
        charts.push(chart);
    }

    // Chart: Grid Limit - Without SAMBA
    const elGridWithout = document.getElementById('chartGridWithout');
    if (elGridWithout) {
        const chart = echarts.init(elGridWithout);
        chart.setOption({
            ...baseOption,
            xAxis: { ...baseOption.xAxis, data: gridLabels },
            series: [
                {
                    name: 'Netlimiet',
                    type: 'line',
                    smooth: false,
                    symbol: 'none',
                    data: [60, 60, 60, 60, 60, 60, 60, 60, 60],
                    lineStyle: { color: '#E53935', type: 'dashed', width: 2 },
                    itemStyle: { color: '#E53935' },
                    endLabel: inlineLabel('#E53935')
                },
                {
                    name: 'Verbruik',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [30, 25, 35, 55, 72, 68, 75, 50, 35],
                    lineStyle: { color: 'rgba(229, 57, 53, 0.7)', width: 2 },
                    areaStyle: { color: 'rgba(229, 57, 53, 0.15)' },
                    itemStyle: { color: '#E53935' },
                    endLabel: inlineLabel('#E53935')
                }
            ]
        });
        charts.push(chart);
    }

    // Chart: Grid Limit - With SAMBA
    const elGridWith = document.getElementById('chartGridWith');
    if (elGridWith) {
        const chart = echarts.init(elGridWith);
        chart.setOption({
            ...baseOption,
            xAxis: { ...baseOption.xAxis, data: gridLabels },
            series: [
                {
                    name: 'Netlimiet',
                    type: 'line',
                    smooth: false,
                    symbol: 'none',
                    data: [60, 60, 60, 60, 60, 60, 60, 60, 60],
                    lineStyle: { color: '#E53935', type: 'dashed', width: 2 },
                    itemStyle: { color: '#E53935' },
                    endLabel: inlineLabel('#E53935')
                },
                {
                    name: 'Verbruik',
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    data: [30, 25, 35, 50, 58, 55, 58, 48, 35],
                    lineStyle: { color: '#43A047', width: 2 },
                    areaStyle: { color: 'rgba(67, 160, 71, 0.2)' },
                    itemStyle: { color: '#43A047' },
                    endLabel: inlineLabel('#43A047')
                }
            ]
        });
        charts.push(chart);
    }

    // Unified resize handler - debounced for performance
    let resizeTimer;
    const resizeAllCharts = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            charts.forEach(c => {
                const dom = c.getDom();
                if (dom && dom.offsetWidth > 0) {
                    // Force the canvas to match parent width
                    const parent = dom.parentElement;
                    if (parent) {
                        dom.style.width = parent.clientWidth + 'px';
                        dom.style.height = parent.clientHeight + 'px';
                    }
                    c.resize();
                }
            });
        }, 50);
    };
    window.addEventListener('resize', resizeAllCharts);

    // Also handle orientation change (mobile/iPad)
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeAllCharts, 100);
        setTimeout(resizeAllCharts, 500);
    });

    // Use ResizeObserver to catch container size changes
    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
            resizeAllCharts();
        });
        document.querySelectorAll('.chart-wrapper').forEach(el => {
            ro.observe(el);
        });
    }

    // Also resize on visibility change (tab switch, etc.)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) setTimeout(resizeAllCharts, 100);
    });
}

/* ----------------------------------------
   Contact Form
   ---------------------------------------- */
function initContactForm() {
    const form = document.getElementById('requestForm');
    const formSuccess = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const required = form.querySelectorAll('[required]');
        let valid = true;
        required.forEach(input => {
            if (!input.value.trim()) {
                valid = false;
                input.style.borderColor = '#E53935';
            } else {
                input.style.borderColor = '';
            }
        });

        // Email validation
        const email = form.querySelector('#email');
        if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            valid = false;
            email.style.borderColor = '#E53935';
        }

        if (valid) {
            // Send form data via FormSubmit (no mail popup)
            const clickedBtn = e.submitter ? e.submitter.textContent : 'Aanvraag';
            const formData = new FormData(form);
            formData.append('_subject', clickedBtn + ' - ' + form.querySelector('#companyName').value);
            formData.append('type', clickedBtn);

            fetch('https://formsubmit.co/ajax/leon@smart-homie.nl', {
                method: 'POST',
                body: formData
            }).then(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
            }).catch(() => {
                form.style.display = 'none';
                formSuccess.style.display = 'block';
            });
        }
    });

    // Clear error styling on input
    form.querySelectorAll('input, textarea').forEach(el => {
        el.addEventListener('input', () => {
            el.style.borderColor = '';
        });
    });
}

/* ----------------------------------------
   Heartbeat Repeat (every 5 seconds)
   ---------------------------------------- */
function initHeartbeatRepeat() {
    const line = document.querySelector('.heartbeat-line');
    if (!line) return;

    setTimeout(() => {
        function pulseHeartbeat() {
            line.style.animation = 'none';
            line.getBoundingClientRect();
            line.style.animation = 'drawHeartbeat 2s ease-in-out forwards';
        }

        pulseHeartbeat();
        setInterval(pulseHeartbeat, 5000);
    }, 2500);
}

/* ----------------------------------------
   Dashes: animate in then move on scroll
   ---------------------------------------- */
function initDashesStop() {
    const dashes = document.querySelector('.nav-dashes-inner');
    if (!dashes) return;

    setTimeout(() => {
        dashes.classList.add('stopped');
    }, 2000);

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const offset = -(scrollY * 0.3) % 200;
        dashes.style.transform = `translateX(${offset}px)`;
    });
}

/* ----------------------------------------
   Sankey Power Flow Visualization (Canvas)
   Storytelling animation: Grid first, then Solar
   takes over, then Battery enables even more solar.
   Over 30 minutes the nodes subtly reposition.
   ---------------------------------------- */
function initGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const baseW = 550, baseH = 600;

    function resizeCanvas() {
        const wrapper = canvas.parentElement;
        const displayW = wrapper.clientWidth;
        const scale = displayW / baseW;
        const displayH = baseH * scale;
        canvas.width = displayW * dpr;
        canvas.height = displayH * dpr;
        canvas.style.width = displayW + 'px';
        canvas.style.height = displayH + 'px';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const ctx = canvas.getContext('2d');

    const START_DELAY = 4.5;
    const STORY_DURATION = 90; // 90 seconds for the full story
    const t0 = performance.now() / 1000;

    // --- Colors ---
    const COL_SOLAR = { r: 238, g: 255, b: 65 };   // SAMBA yellow #EEFF41
    const COL_GRID  = { r: 0,   g: 102, b: 255 };  // Blue #0066FF
    const COL_BATT  = { r: 8,   g: 94,  b: 52 };   // Green #085E34

    function rgba(c, a) { return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')'; }
    // --- Nodes ---
    const W = baseW, H = baseH;
    const nodes = [
        { id: 'solar',    x: W * 0.45, y: 50,  r: 7, col: COL_SOLAR, revealT: 20, baseX: W * 0.45, baseY: 50,  label: 'Sun' },
        { id: 'grid',     x: 50,       y: 240, r: 7, col: COL_GRID,  revealT: 0,  baseX: 50,       baseY: 240, label: 'Grid' },
        { id: 'business', x: W * 0.45, y: 270, r: 9, col: COL_SOLAR, revealT: 0,  baseX: W * 0.45, baseY: 270, label: 'SAMBA' },
        { id: 'battery',  x: 80,       y: 450, r: 6, col: COL_BATT,  revealT: 55, baseX: 80,       baseY: 450, label: 'Battery' },
        { id: 'ev',       x: W * 0.70, y: 180, r: 5, col: COL_SOLAR, revealT: 8,  baseX: W * 0.70, baseY: 180, label: 'Charger' },
        { id: 'hp',       x: W * 0.85, y: 240, r: 5, col: COL_SOLAR, revealT: 10, baseX: W * 0.85, baseY: 240, label: 'Heat Pump' },
        { id: 'boiler',   x: W * 0.78, y: 310, r: 5, col: COL_SOLAR, revealT: 12, baseX: W * 0.78, baseY: 310, label: 'Boiler' },
        { id: 'chiller',  x: W * 0.90, y: 370, r: 5, col: COL_SOLAR, revealT: 14, baseX: W * 0.90, baseY: 370, label: 'Chiller' },
        { id: 'coolcell', x: W * 0.70, y: 420, r: 5, col: COL_SOLAR, revealT: 15, baseX: W * 0.70, baseY: 420, label: 'Coolcell' },
        { id: 'light',    x: W * 0.85, y: 470, r: 5, col: COL_SOLAR, revealT: 16, baseX: W * 0.85, baseY: 470, label: 'Lightning' },
    ];

    function nodeById(id) { return nodes.find(n => n.id === id); }

    // --- Flows ---
    // Story phases:
    // Phase 1 (0-20s): Grid + Business + Assets appear. Grid is main supply (thick line)
    // Phase 2 (20-55s): Solar appears, solar flow grows, grid flow shrinks
    // Phase 3 (55-90s): Battery appears, solar->battery flow, even more solar usage, grid minimal
    const flows = [
        { from: 'solar',    to: 'business', col: COL_SOLAR, revealT: 22, curKW: 0, tgtKW: 0 },
        { from: 'grid',     to: 'business', col: COL_GRID,  revealT: 2,  curKW: 0, tgtKW: 8 },
        { from: 'business', to: 'ev',       col: COL_GRID,  revealT: 10, curKW: 0, tgtKW: 2.5 },
        { from: 'business', to: 'hp',       col: COL_GRID,  revealT: 12, curKW: 0, tgtKW: 2 },
        { from: 'business', to: 'boiler',   col: COL_GRID,  revealT: 14, curKW: 0, tgtKW: 1.5 },
        { from: 'business', to: 'chiller',  col: COL_GRID,  revealT: 15, curKW: 0, tgtKW: 1 },
        { from: 'business', to: 'coolcell', col: COL_GRID,  revealT: 16, curKW: 0, tgtKW: 0.8 },
        { from: 'business', to: 'light',    col: COL_GRID,  revealT: 17, curKW: 0, tgtKW: 0.5 },
        { from: 'solar',    to: 'battery',  col: COL_BATT,  revealT: 60, curKW: 0, tgtKW: 0 },
        { from: 'battery',  to: 'business', col: COL_BATT,  revealT: 65, curKW: 0, tgtKW: 0 },
    ];

    // --- Mesh lines ---
    const meshPairs = [
        ['solar', 'grid'], ['solar', 'ev'], ['grid', 'coolcell'],
        ['battery', 'coolcell'], ['battery', 'boiler'], ['ev', 'hp'],
        ['hp', 'boiler'], ['light', 'chiller'], ['ev', 'light'],
        ['grid', 'boiler'], ['solar', 'light'], ['chiller', 'coolcell'],
    ];

    // --- Satellite dots around business hub ---
    const satellites = [];
    for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        satellites.push({
            baseAngle: angle,
            dist: 20 + Math.random() * 12,
            speed: 0.15 + Math.random() * 0.2,
            size: 1.5 + Math.random() * 1.5,
        });
    }

    // --- Node position drift (every 30 min = 1800s, but we do subtle drift continuously) ---
    let lastDriftUpdate = 0;
    const DRIFT_INTERVAL = 1800; // 30 minutes

    function updateNodeDrift(now) {
        if (now - lastDriftUpdate < DRIFT_INTERVAL) return;
        lastDriftUpdate = now;

        nodes.forEach(n => {
            if (n.id !== 'business') {
                n.baseX += (Math.random() - 0.5) * 20;
                n.baseY += (Math.random() - 0.5) * 20;
            }
        });
    }

    // --- Story-driven flow updates ---
    // Target steady-state ratio: zon:batterij:grid = 70:25:5%
    // kW values x10 (realistic scale: total ~100 kW)
    function updateStoryFlows(now) {
        let solarPower, gridPower, battSolarPower, battToBizPower;

        if (now < 20) {
            // Phase 1: Only grid
            solarPower = 0;
            gridPower = 80;
            battSolarPower = 0;
            battToBizPower = 0;
        } else if (now < 55) {
            // Phase 2: Solar grows in, grid shrinks
            const t = (now - 20) / 35;
            solarPower = t * 60;
            gridPower = 80 - t * 65;
            battSolarPower = 0;
            battToBizPower = 0;
        } else if (now < STORY_DURATION) {
            // Phase 3: Battery appears, solar dominates
            const t = (now - 55) / 35;
            solarPower = 60 + t * 10;        // grows to 70
            gridPower = 15 - t * 10;          // shrinks to 5
            battSolarPower = t * 25;          // solar to battery grows to 25
            battToBizPower = t * 15;          // battery feeds business
        } else {
            // After story: gentle randomization around 70:25:5 ratio
            const cycle = Math.sin(now * 0.05) * 0.5 + 0.5;
            solarPower = 65 + cycle * 15;      // ~70 kW
            gridPower = 3 + (1 - cycle) * 7;   // ~5 kW
            battSolarPower = 20 + cycle * 10;   // ~25 kW to battery
            battToBizPower = 15 + cycle * 5;    // battery to biz
        }

        // Set flow targets
        flows[0].tgtKW = solarPower;        // solar -> business
        flows[1].tgtKW = gridPower;          // grid -> business

        // Business to assets - color changes based on dominant source
        const totalIn = solarPower + gridPower + battToBizPower;
        const solarRatio = totalIn > 0 ? solarPower / totalIn : 0;
        const gridRatio = totalIn > 0 ? gridPower / totalIn : 0;
        const battRatio = totalIn > 0 ? battToBizPower / totalIn : 0;

        // Blend color based on ratios
        const blendedCol = {
            r: Math.round(COL_SOLAR.r * solarRatio + COL_GRID.r * gridRatio + COL_BATT.r * battRatio),
            g: Math.round(COL_SOLAR.g * solarRatio + COL_GRID.g * gridRatio + COL_BATT.g * battRatio),
            b: Math.round(COL_SOLAR.b * solarRatio + COL_GRID.b * gridRatio + COL_BATT.b * battRatio)
        };

        // Update asset flow colors and targets (scaled for larger kW)
        const assetShares = [0.25, 0.20, 0.18, 0.15, 0.12, 0.10];
        for (let i = 2; i <= 7; i++) {
            flows[i].col = blendedCol;
            flows[i].tgtKW = totalIn * assetShares[i - 2] * 0.6;
        }

        flows[8].tgtKW = battSolarPower;    // solar -> battery
        flows[9].tgtKW = battToBizPower;     // battery -> business
    }

    // --- Smooth interpolation for flow values ---
    function lerpFlows() {
        const speed = 0.02;
        flows.forEach(f => {
            f.curKW += (f.tgtKW - f.curKW) * speed;
        });
    }

    // --- Flow animation offset (moving dashes) ---
    let flowOffset = 0;

    // --- Bezier curve between two nodes ---
    function getFlowPath(fromN, toN) {
        const dx = toN.x - fromN.x;
        const dy = toN.y - fromN.y;
        const cx1 = fromN.x + dx * 0.1;
        const cy1 = fromN.y + dy * 0.5;
        const cx2 = fromN.x + dx * 0.9;
        const cy2 = fromN.y + dy * 0.5;
        return { x0: fromN.x, y0: fromN.y, cx1, cy1, cx2, cy2, x3: toN.x, y3: toN.y };
    }

    // --- Render ---
    function render() {
        const rawNow = performance.now() / 1000 - t0;
        const now = Math.max(0, rawNow - START_DELAY);

        const displayW = canvas.width / dpr;
        const displayH = canvas.height / dpr;
        const scaleX = displayW / W;
        const scaleY = displayH / H;

        ctx.setTransform(dpr * scaleX, 0, 0, dpr * scaleY, 0, 0);
        ctx.clearRect(0, 0, W, H);

        // Global breathing offset
        const breatheY = Math.sin(rawNow * 0.8) * 1.2;

        ctx.save();
        ctx.translate(0, breatheY);

        updateNodeDrift(now);
        updateStoryFlows(now);
        lerpFlows();
        flowOffset += 0.015;

        // Subtle node position animation
        nodes.forEach(n => {
            const wobble = Math.sin(rawNow * 0.3 + n.baseX) * 3;
            n.x = n.baseX + wobble;
            n.y = n.baseY + Math.cos(rawNow * 0.25 + n.baseY) * 2;
        });

        // === 1. Mesh lines ===
        const meshRevealT = 30;
        if (now > meshRevealT) {
            const meshAlpha = Math.min(0.12, (now - meshRevealT) / 40 * 0.12);
            ctx.strokeStyle = rgba(COL_SOLAR, meshAlpha);
            ctx.lineWidth = 0.5;
            meshPairs.forEach(pair => {
                const a = nodeById(pair[0]);
                const b = nodeById(pair[1]);
                if (!a || !b) return;
                if (now < a.revealT || now < b.revealT) return;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            });

            ctx.fillStyle = rgba(COL_SOLAR, meshAlpha * 2);
            meshPairs.forEach(pair => {
                const a = nodeById(pair[0]);
                const b = nodeById(pair[1]);
                if (!a || !b) return;
                if (now < a.revealT || now < b.revealT) return;
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                ctx.beginPath();
                ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // === 2. Sankey flow lines ===
        flows.forEach(f => {
            if (now < f.revealT) return;
            if (f.curKW < 0.05) return;
            const revealProgress = Math.min(1, (now - f.revealT) / 8);
            const fromN = nodeById(f.from);
            const toN = nodeById(f.to);
            if (!fromN || !toN) return;

            const path = getFlowPath(fromN, toN);
            const thickness = Math.max(1, f.curKW * 0.25) * revealProgress;

            ctx.beginPath();
            ctx.moveTo(path.x0, path.y0);
            ctx.bezierCurveTo(path.cx1, path.cy1, path.cx2, path.cy2, path.x3, path.y3);
            ctx.strokeStyle = rgba(f.col, 0.25 * revealProgress);
            ctx.lineWidth = thickness;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(path.x0, path.y0);
            ctx.bezierCurveTo(path.cx1, path.cy1, path.cx2, path.cy2, path.x3, path.y3);
            ctx.strokeStyle = rgba(f.col, 0.5 * revealProgress);
            ctx.lineWidth = Math.max(0.5, thickness * 0.4);
            ctx.setLineDash([4, 8]);
            ctx.lineDashOffset = -flowOffset * 100;
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // === 3. Nodes (glowing dots) ===
        nodes.forEach((n, ni) => {
            if (now < n.revealT) return;
            const revealProgress = Math.min(1, (now - n.revealT) / 3);
            const pulse = 0.7 + 0.3 * Math.sin(rawNow * (1.5 + ni * 0.3));
            const glowR = n.r * 3;

            // Outer glow
            const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
            grad.addColorStop(0, rgba(n.col, 0.4 * pulse * revealProgress));
            grad.addColorStop(1, rgba(n.col, 0));
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            // Core dot
            ctx.fillStyle = rgba(n.col, 0.9 * revealProgress);
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * revealProgress, 0, Math.PI * 2);
            ctx.fill();
        });

        // === 4. Satellite dots around business hub ===
        const biz = nodeById('business');
        if (now > 5) {
            const satAlpha = Math.min(0.5, (now - 5) / 20);
            satellites.forEach(s => {
                const angle = s.baseAngle + rawNow * s.speed;
                const sx = biz.x + Math.cos(angle) * s.dist;
                const sy = biz.y + Math.sin(angle) * s.dist;
                ctx.fillStyle = rgba(COL_SOLAR, satAlpha * (0.5 + 0.5 * Math.sin(rawNow * 2 + s.baseAngle)));
                ctx.beginPath();
                ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }

        // === 5. Flow value labels (kW) next to flows ===
        if (now > STORY_DURATION) {
            const labelAlpha = Math.min(0.5, (now - STORY_DURATION) / 10);
            ctx.font = '8px "Roboto Mono", monospace';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            flows.forEach(f => {
                if (f.curKW < 0.1) return;
                const fromN = nodeById(f.from);
                const toN = nodeById(f.to);
                const mx = (fromN.x + toN.x) / 2 + 8;
                const my = (fromN.y + toN.y) / 2 - 6;
                ctx.fillStyle = rgba(f.col, labelAlpha);
                ctx.fillText(f.curKW.toFixed(1) + ' kW', mx, my);
            });
        }

        ctx.restore();
        requestAnimationFrame(render);
    }

    render();
}
