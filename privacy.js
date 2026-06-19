/* =================================================================
   QUADRIFOGLIO 2010 S.r.l.s. — Privacy & Cookie consent (GDPR / EU)
   -----------------------------------------------------------------
   • Injects a cookie-consent banner (Accept / Reject / Customize) with
     an animated cookie that appears and disappears.
   • Injects a "little interface" (modal) showing the full Privacy &
     Cookie Policy, opened by tapping the footer link.
   • Stores the choice in localStorage (`qf_consent`) — a strictly
     technical item that needs no consent itself — and exposes it on
     window.qfConsent so any future analytics can be gated by it.
   • No tracking, no profiling, no third-party cookies are set.
   ================================================================= */
(function () {
  "use strict";

  var STORAGE_KEY = "qf_consent";
  var CONSENT_VERSION = 1;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- consent state ---------- */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return (data && data.v === CONSENT_VERSION) ? data : null;
    } catch (e) { return null; }
  }
  function saveConsent(analytics) {
    var data = { v: CONSENT_VERSION, necessary: true, analytics: !!analytics, ts: new Date().toISOString() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
    window.qfConsent = data;
    return data;
  }
  window.qfConsent = readConsent();

  /* ---------- graphics ---------- */
  var cookieSVG =
    '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M24 4a20 20 0 1 0 20 20 6 6 0 0 1-6-6 6 6 0 0 1-6-6 6 6 0 0 1-2-12z" fill="#d8a45a"/>' +
      '<circle cx="17" cy="16" r="2.6" fill="#6b3d18"/>' +
      '<circle cx="30" cy="14" r="1.8" fill="#6b3d18"/>' +
      '<circle cx="33" cy="27" r="2.4" fill="#6b3d18"/>' +
      '<circle cx="24" cy="24" r="2" fill="#6b3d18"/>' +
      '<circle cx="15" cy="29" r="2.2" fill="#6b3d18"/>' +
      '<circle cx="25" cy="34" r="1.7" fill="#6b3d18"/>' +
      '<circle cx="22" cy="13" r="1.2" fill="#8a5526"/>' +
    '</svg>';

  var miniCookieSVG =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="11" fill="#d8a45a"/>' +
      '<circle cx="8" cy="9" r="1.6" fill="#6b3d18"/>' +
      '<circle cx="15" cy="8" r="1.1" fill="#6b3d18"/>' +
      '<circle cx="16" cy="15" r="1.5" fill="#6b3d18"/>' +
      '<circle cx="9" cy="16" r="1.3" fill="#6b3d18"/>' +
      '<circle cx="12" cy="12" r="1" fill="#6b3d18"/>' +
    '</svg>';

  /* ---------- the policy text (also lives, full, in privacy.html) ---------- */
  var policyHTML =
    '<h2 id="qcModalTitle">Informativa Privacy &amp; Cookie Policy</h2>' +
    '<p class="qc-updated">Ultimo aggiornamento: giugno 2026</p>' +

    '<h3>1. Titolare del trattamento</h3>' +
    '<p><strong>Quadrifoglio 2010 S.r.l.s.</strong><br>' +
    'Via Maurizio Busnengo, 4/A — 00053 Civitavecchia (RM), Italia<br>' +
    'P.IVA / C.F. 17951101009<br>' +
    'Email: <a href="mailto:quadrifoglio2010srls@libero.it">quadrifoglio2010srls@libero.it</a><br>' +
    'Tel: <a href="tel:+39076631216">+39 0766 31216</a></p>' +

    '<h3>2. Dati trattati e finalità</h3>' +
    '<p><strong>a) Dati di navigazione (log dell’hosting).</strong> Il sito è ospitato su ' +
    '<em>GitHub Pages</em> (GitHub, Inc. — USA). Per garantire sicurezza e integrità del servizio, i ' +
    'server di GitHub registrano automaticamente alcuni dati tecnici dei visitatori, tra cui ' +
    'l’<strong>indirizzo IP</strong>, data e ora della richiesta e informazioni sul ' +
    'browser/dispositivo (user agent). Tali dati sono trattati da GitHub come fornitore di hosting per ' +
    'finalità di sicurezza e prevenzione degli abusi e non vengono da noi utilizzati per tracciamento o ' +
    'marketing. <em>Base giuridica:</em> legittimo interesse alla sicurezza e all’erogazione del sito ' +
    '(art. 6.1.f GDPR).</p>' +
    '<p><strong>b) Modulo di contatto.</strong> Il modulo non invia dati a un nostro server: alla ' +
    'compilazione si apre il programma di posta del tuo dispositivo con un messaggio precompilato ' +
    '(nome, email, telefono, tipo di intervento, messaggio) indirizzato a ' +
    'quadrifoglio2010srls@libero.it. I dati che ci invii via email sono usati esclusivamente per ' +
    'rispondere alla tua richiesta. <em>Base giuridica:</em> riscontro alle richieste ed esecuzione di ' +
    'misure precontrattuali (art. 6.1.b GDPR).</p>' +
    '<p><strong>c) Font e risorse grafiche.</strong> I caratteri tipografici sono ospitati ' +
    '<strong>localmente</strong> su questo sito: non vengono effettuate chiamate ai server di Google e ' +
    'nessun indirizzo IP è trasmesso a terzi per il loro caricamento.</p>' +
    '<p><strong>d) Link esterni.</strong> Alcuni pulsanti rimandano a documenti su Google Drive ' +
    '(Google Ireland Ltd. / Google LLC). Aprendoli vieni reindirizzato a un servizio di terze parti ' +
    'soggetto alla propria informativa; il trattamento avviene solo se scegli volontariamente di ' +
    'aprire tali link.</p>' +

    '<h3>3. Cookie e tecnologie simili</h3>' +
    '<p>Questo sito <strong>non utilizza cookie di profilazione o di marketing</strong> e ' +
    '<strong>non impiega strumenti di analisi statistica di terze parti</strong> (es. Google ' +
    'Analytics). L’unico elemento memorizzato sul tuo dispositivo è una preferenza tecnica salvata ' +
    'nella memoria locale del browser (<em>localStorage</em>), che conserva la tua scelta relativa a ' +
    'questa informativa per non riproporre il banner ad ogni visita.</p>' +
    '<table class="qc-table"><thead><tr><th>Nome</th><th>Tipo</th><th>Finalità</th><th>Durata</th></tr></thead>' +
    '<tbody><tr>' +
    '<td>qf_consent</td><td>Tecnico (localStorage)</td>' +
    '<td>Memorizza la scelta espressa su questa informativa</td>' +
    '<td>Persistente, fino a revoca o cancellazione manuale</td>' +
    '</tr></tbody></table>' +
    '<p>I cookie tecnici e di preferenza non richiedono consenso ai sensi dell’art. 122 del Codice ' +
    'Privacy e delle Linee guida del Garante.</p>' +

    '<h3>4. Trasferimento dati extra-UE</h3>' +
    '<p>L’hosting (GitHub, Inc.) ed eventuali servizi collegati (Google Drive, se utilizzato) possono ' +
    'comportare il trasferimento di dati verso gli Stati Uniti. Tali trasferimenti avvengono sulla base ' +
    'delle garanzie previste dal GDPR (Clausole Contrattuali Standard e/o adesione al EU-U.S. Data ' +
    'Privacy Framework).</p>' +

    '<h3>5. Conservazione</h3>' +
    '<ul>' +
    '<li>Log tecnici dell’hosting: conservati da GitHub per il tempo necessario alle finalità di ' +
    'sicurezza, secondo le policy di GitHub.</li>' +
    '<li>Email ricevute tramite richieste di contatto: per il tempo necessario a gestire la richiesta e ' +
    'ad adempiere a eventuali obblighi di legge.</li>' +
    '<li>Preferenza <em>qf_consent</em>: fino a revoca o cancellazione.</li>' +
    '</ul>' +

    '<h3>6. Diritti dell’interessato</h3>' +
    '<p>Ai sensi degli artt. 15-22 GDPR hai diritto di accesso, rettifica, cancellazione, limitazione, ' +
    'opposizione, portabilità dei dati e di revocare il consenso in qualsiasi momento. Per esercitare i ' +
    'tuoi diritti scrivi a <a href="mailto:quadrifoglio2010srls@libero.it">quadrifoglio2010srls@libero.it</a>. ' +
    'Hai inoltre diritto di proporre reclamo all’Autorità Garante per la protezione dei dati personali ' +
    '(<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener">garanteprivacy.it</a>).</p>' +

    '<h3>7. Revoca e gestione delle preferenze</h3>' +
    '<p>Puoi modificare o revocare le tue scelte in qualsiasi momento tramite il pulsante ' +
    '<strong>“Preferenze cookie”</strong> nel footer del sito, oppure cancellando i dati di navigazione ' +
    'del browser.</p>' +

    '<h3>8. Modifiche</h3>' +
    '<p>La presente informativa può essere aggiornata nel tempo. Ti invitiamo a consultarla ' +
    'periodicamente.</p>';

  /* ---------- helpers ---------- */
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* floating cookies that appear and disappear (one-shot, auto-removed) */
  function spawnCookies(n, mode) {
    if (reduceMotion) return;
    var banner = document.getElementById("qcBanner");
    if (!banner) return;
    var layer = banner.querySelector(".qc-cookie-burst");
    if (!layer) return;
    for (var i = 0; i < n; i++) {
      (function (i) {
        var c = document.createElement("span");
        c.className = "qc-floatcookie" + (mode === "burst" ? " is-burst" : "");
        c.innerHTML = miniCookieSVG;
        c.style.left = (6 + Math.random() * 88) + "%";
        c.style.setProperty("--dx", ((Math.random() * 2 - 1) * 70).toFixed(0) + "px");
        c.style.setProperty("--rot", ((Math.random() * 2 - 1) * 200).toFixed(0) + "deg");
        c.style.setProperty("--sc", (0.6 + Math.random() * 0.7).toFixed(2));
        c.style.animationDelay = (i * 0.07).toFixed(2) + "s";
        c.addEventListener("animationend", function () { c.remove(); });
        layer.appendChild(c);
      })(i);
    }
  }

  /* ---------- build banner ---------- */
  function buildBanner() {
    var banner = el(
      '<aside class="qc-banner" id="qcBanner" role="dialog" aria-live="polite" ' +
        'aria-label="Informativa sui cookie" aria-describedby="qcDesc">' +
        '<span class="qc-cookie-burst" aria-hidden="true"></span>' +
        '<div class="qc-banner-inner">' +
          '<span class="qc-icon" aria-hidden="true">' + cookieSVG + '</span>' +
          '<div class="qc-body">' +
            '<strong class="qc-title">Rispettiamo la tua privacy</strong>' +
            '<p class="qc-text" id="qcDesc">Questo sito usa <strong>solo cookie tecnici</strong> ' +
              'necessari al funzionamento e <strong>non effettua profilazione</strong>. L’hosting ' +
              '(GitHub Pages) registra l’indirizzo IP dei visitatori per finalità di sicurezza. ' +
              '<a href="privacy.html" class="qc-link" data-open-policy>Leggi l’informativa</a>.</p>' +
            '<div class="qc-prefs" id="qcPrefs" hidden>' +
              '<label class="qc-pref">' +
                '<span class="qc-pref-txt"><b>Necessari</b><small>Sempre attivi: funzionamento e ' +
                  'sicurezza del sito.</small></span>' +
                '<span class="qc-switch is-locked"><input type="checkbox" checked disabled aria-label="Cookie necessari (sempre attivi)"><i></i></span>' +
              '</label>' +
              '<p class="qc-pref-note">Questo sito non utilizza cookie statistici, di profilazione o di marketing.</p>' +
            '</div>' +
          '</div>' +
          '<div class="qc-actions">' +
            '<button type="button" class="qc-btn qc-btn-ghost" id="qcReject">Rifiuta</button>' +
            '<button type="button" class="qc-btn qc-btn-ghost" id="qcCustomize" aria-expanded="false" aria-controls="qcPrefs">Personalizza</button>' +
            '<button type="button" class="qc-btn qc-btn-accept" id="qcAccept">Accetta</button>' +
            '<button type="button" class="qc-btn qc-btn-accept" id="qcSave" hidden>Salva preferenze</button>' +
          '</div>' +
        '</div>' +
      '</aside>'
    );
    document.body.appendChild(banner);

    var prefs = banner.querySelector("#qcPrefs");
    var btnCustomize = banner.querySelector("#qcCustomize");
    var btnAccept = banner.querySelector("#qcAccept");
    var btnSave = banner.querySelector("#qcSave");

    btnCustomize.addEventListener("click", function () {
      var open = prefs.hasAttribute("hidden");
      if (open) { prefs.removeAttribute("hidden"); } else { prefs.setAttribute("hidden", ""); }
      btnCustomize.setAttribute("aria-expanded", String(open));
      btnSave.hidden = !open;
      btnAccept.hidden = open;
    });
    banner.querySelector("#qcAccept").addEventListener("click", function () { saveConsent(true); hideBanner(true); });
    banner.querySelector("#qcReject").addEventListener("click", function () { saveConsent(false); hideBanner(true); });
    btnSave.addEventListener("click", function () { saveConsent(false); hideBanner(true); });
    banner.querySelector("[data-open-policy]").addEventListener("click", function (e) { e.preventDefault(); openPolicy(); });

    return banner;
  }

  function showBanner() {
    var banner = document.getElementById("qcBanner") || buildBanner();
    // reset to default (collapsed) view every time it is reopened
    var prefs = banner.querySelector("#qcPrefs");
    prefs.setAttribute("hidden", "");
    banner.querySelector("#qcCustomize").setAttribute("aria-expanded", "false");
    banner.querySelector("#qcSave").hidden = true;
    banner.querySelector("#qcAccept").hidden = false;

    banner.hidden = false;
    banner.classList.remove("qc-hide");
    // next frame -> trigger the slide/fade-in transition
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add("qc-show");
        spawnCookies(5, "rise");
      });
    });
  }

  function hideBanner() {
    var banner = document.getElementById("qcBanner");
    if (!banner) return;
    spawnCookies(6, "burst");
    banner.classList.remove("qc-show");
    banner.classList.add("qc-hide");
    var done = function () { banner.hidden = true; banner.removeEventListener("transitionend", done); };
    if (reduceMotion) { done(); }
    else {
      banner.addEventListener("transitionend", done);
      setTimeout(done, 700); // safety net if transitionend doesn't fire
    }
  }

  /* ---------- build policy modal (the "little interface") ---------- */
  var lastFocus = null;
  function buildModal() {
    var modal = el(
      '<div class="qc-modal" id="qcModal" hidden>' +
        '<div class="qc-modal-backdrop" data-close-policy></div>' +
        '<div class="qc-modal-card" role="dialog" aria-modal="true" aria-labelledby="qcModalTitle" tabindex="-1">' +
          '<button type="button" class="qc-modal-close" data-close-policy aria-label="Chiudi informativa">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>' +
          '<div class="qc-modal-scroll">' + policyHTML +
            '<div class="qc-modal-foot">' +
              '<button type="button" class="qc-btn qc-btn-ghost" id="qcModalPrefs">Gestisci preferenze cookie</button>' +
              '<button type="button" class="qc-btn qc-btn-accept" data-close-policy>Ho capito</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-close-policy]").forEach(function (b) {
      b.addEventListener("click", closePolicy);
    });
    modal.querySelector("#qcModalPrefs").addEventListener("click", function () { closePolicy(); showBanner(); });
    return modal;
  }

  function openPolicy() {
    var modal = document.getElementById("qcModal") || buildModal();
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("qc-noscroll");
    requestAnimationFrame(function () { modal.classList.add("qc-open"); });
    var card = modal.querySelector(".qc-modal-card");
    if (card) card.focus();
    document.addEventListener("keydown", onKeydown);
  }
  function closePolicy() {
    var modal = document.getElementById("qcModal");
    if (!modal) return;
    modal.classList.remove("qc-open");
    document.body.classList.remove("qc-noscroll");
    document.removeEventListener("keydown", onKeydown);
    var done = function () { modal.hidden = true; modal.removeEventListener("transitionend", done); };
    if (reduceMotion) { done(); } else { modal.addEventListener("transitionend", done); setTimeout(done, 400); }
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKeydown(e) { if (e.key === "Escape") closePolicy(); }

  /* ---------- public API + wiring ---------- */
  window.qfOpenPrivacy = openPolicy;
  window.qfOpenCookiePreferences = showBanner;

  function wireFooter() {
    var link = document.getElementById("privacyLink");
    if (link) link.addEventListener("click", function (e) { e.preventDefault(); openPolicy(); });
    var prefsBtn = document.getElementById("cookiePrefsBtn");
    if (prefsBtn) prefsBtn.addEventListener("click", function (e) { e.preventDefault(); showBanner(); });
  }

  function init() {
    wireFooter();
    if (!readConsent()) {
      // small delay so the page paints first, then the cookie animates in
      setTimeout(showBanner, reduceMotion ? 0 : 600);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
