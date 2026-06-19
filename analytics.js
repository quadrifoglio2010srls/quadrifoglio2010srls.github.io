(function () {
  "use strict";

  var GA_ID = "G-XJVL5Q11KN";
  var SCRIPT_ID = "ga-gtag";
  var CONSENT_VERSION = 2;
  var loaded = false;

  function readConsent() {
    try {
      var raw = localStorage.getItem("qf_consent");
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && typeof data === "object" && data.v === CONSENT_VERSION ? data : null;
    } catch (e) {
      return null;
    }
  }

  function applyConsent(analytics) {
    if (analytics) {
      loadAnalytics();
      return;
    }

    deleteAnalyticsCookies();

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        functionality_storage: "granted",
        security_storage: "granted"
      });
    }
  }

  function loadAnalytics() {
    if (loaded || document.getElementById(SCRIPT_ID)) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      functionality_storage: "granted",
      security_storage: "granted"
    });

    var script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    script.onload = function () {
      window.gtag("config", GA_ID, { anonymize_ip: true });
    };
    document.head.appendChild(script);
  }

  function deleteAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = ["", host, "." + host];
    document.cookie.split(";").forEach(function (cookie) {
      var name = cookie.split("=")[0].trim();
      if (name !== "_ga" && name.indexOf("_ga_") !== 0) return;
      domains.forEach(function (domain) {
        var domainPart = domain ? "; domain=" + domain : "";
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + domainPart;
      });
    });
  }

  function syncFromStorage() {
    var consent = readConsent();
    applyConsent(!!(consent && consent.analytics));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", syncFromStorage);
  } else {
    syncFromStorage();
  }

  window.addEventListener("qfconsentchange", function (event) {
    applyConsent(!!(event && event.detail && event.detail.analytics));
  });
})();
