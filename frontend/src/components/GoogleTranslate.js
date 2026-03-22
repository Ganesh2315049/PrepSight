import React, { useEffect } from 'react';

function GoogleTranslate() {
  useEffect(() => {
    const initTranslate = () => {
      if (!window.google || !window.google.translate) {
        return;
      }

      const container = document.getElementById('google_translate_element');
      if (!container || container.childNodes.length > 0) {
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,ta,hi,te,ml,kn,ur,gu',
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };

    window.googleTranslateElementInit = initTranslate;

    if (document.getElementById('google-translate-script')) {
      initTranslate();
      return undefined;
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (window.googleTranslateElementInit === initTranslate) {
        delete window.googleTranslateElementInit;
      }
    };
  }, []);

  return <div id="google_translate_element" className="translate-wrap" />;
}

export default GoogleTranslate;