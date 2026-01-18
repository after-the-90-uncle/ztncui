const en = require('./i18n/en');
const zh = require('./i18n/zh');

const translations = {
  en,
  zh
};

const defaultLocale = 'en';
const supportedLocales = ['en', 'zh'];

function getLocale(req) {
  if (req.session && req.session.locale) {
    return req.session.locale;
  }

  if (req.query.lang && supportedLocales.includes(req.query.lang)) {
    return req.query.lang;
  }

  const cookieLocale = req.cookies && req.cookies.locale;
  if (cookieLocale && supportedLocales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = req.acceptsLanguages();
  if (acceptLanguage) {
    for (const lang of acceptLanguage) {
      const locale = lang.split('-')[0];
      if (supportedLocales.includes(locale)) {
        return locale;
      }
    }
  }

  return defaultLocale;
}

function setLocale(req, res, locale) {
  if (!supportedLocales.includes(locale)) {
    locale = defaultLocale;
  }
  req.session.locale = locale;
  res.cookie('locale', locale, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true
  });
}

function t(req, key, params = {}) {
  const locale = req.session && req.session.locale ? req.session.locale : defaultLocale;
  const lang = translations[locale] || translations[defaultLocale];

  let text = lang[key] || translations[defaultLocale][key] || key;

  if (params && typeof params === 'object') {
    for (const [placeholder, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
    }
  }

  return text;
}

function getSupportedLocales() {
  return supportedLocales;
}

function getCurrentLocale(req) {
  return req.session && req.session.locale ? req.session.locale : defaultLocale;
}

module.exports = {
  getLocale,
  setLocale,
  t,
  getSupportedLocales,
  getCurrentLocale,
  defaultLocale,
  supportedLocales
};
