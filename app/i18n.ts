export const locales = ["fr", "en", "ar", "es", "pt", "de"] as const;
export type Locale = (typeof locales)[number];

export const platformIds = ["youtube", "tiktok", "instagram", "facebook", "twitter"] as const;
export type PlatformId = (typeof platformIds)[number];
export const qualityPageIds = ["youtube-mp3-320", "youtube-mp4-1080"] as const;
export type QualityPageId = (typeof qualityPageIds)[number];

export type HomeCopy = {
  language: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  ogLocale: string;
  metaTitle: string;
  metaDescription: string;
  nav: [string, string, string];
  navCta: string;
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  ad: string;
  ready: string;
  private: string;
  paste: string;
  empty: string;
  inspect: string;
  inspecting: string;
  convert: string;
  converting: string;
  sample: string;
  chooseFormat: string;
  preparing: string;
  fileReady: string;
  download: string;
  another: string;
  readyToSave: string;
  trust: [string, string, string];
  platformsKicker: string;
  platformsTitle: string;
  platformsIntro: string;
  openTool: string;
  howKicker: string;
  howTitle: string;
  howIntro: string;
  steps: [
    { title: string; text: string },
    { title: string; text: string },
    { title: string; text: string },
  ];
  faqKicker: string;
  faqTitle: string;
  faqIntro: string;
  faqs: { q: string; a: string }[];
  footerText: string;
  footerPlatforms: string;
  footerFormats: string;
  footerLanguages: string;
  responsible: string;
  errors: { empty: string; inspect: string; convert: string };
};

export const platformNames: Record<PlatformId, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "Twitter / X",
};

export const localizedSlugs: Record<Locale, Record<PlatformId, string>> = {
  fr: {
    youtube: "telecharger-video-youtube",
    tiktok: "telecharger-video-tiktok",
    instagram: "telecharger-video-instagram",
    facebook: "telecharger-video-facebook",
    twitter: "telecharger-video-twitter",
  },
  en: {
    youtube: "download-youtube-video",
    tiktok: "download-tiktok-video",
    instagram: "download-instagram-video",
    facebook: "download-facebook-video",
    twitter: "download-twitter-video",
  },
  ar: {
    youtube: "youtube-downloader",
    tiktok: "tiktok-downloader",
    instagram: "instagram-downloader",
    facebook: "facebook-downloader",
    twitter: "twitter-downloader",
  },
  es: {
    youtube: "descargar-video-youtube",
    tiktok: "descargar-video-tiktok",
    instagram: "descargar-video-instagram",
    facebook: "descargar-video-facebook",
    twitter: "descargar-video-twitter",
  },
  pt: {
    youtube: "baixar-video-youtube",
    tiktok: "baixar-video-tiktok",
    instagram: "baixar-video-instagram",
    facebook: "baixar-video-facebook",
    twitter: "baixar-video-twitter",
  },
  de: {
    youtube: "youtube-video-herunterladen",
    tiktok: "tiktok-video-herunterladen",
    instagram: "instagram-video-herunterladen",
    facebook: "facebook-video-herunterladen",
    twitter: "twitter-video-herunterladen",
  },
};

export const localizedQualitySlugs: Record<Locale, Record<QualityPageId, string>> = {
  fr: { "youtube-mp3-320": "youtube-mp3-320-kbps", "youtube-mp4-1080": "youtube-mp4-1080p" },
  en: { "youtube-mp3-320": "youtube-to-mp3-320kbps", "youtube-mp4-1080": "youtube-to-mp4-1080p" },
  ar: { "youtube-mp3-320": "youtube-mp3-320kbps", "youtube-mp4-1080": "youtube-mp4-1080p" },
  es: { "youtube-mp3-320": "youtube-mp3-320-kbps", "youtube-mp4-1080": "youtube-mp4-1080p" },
  pt: { "youtube-mp3-320": "youtube-mp3-320-kbps", "youtube-mp4-1080": "youtube-mp4-1080p" },
  de: { "youtube-mp3-320": "youtube-mp3-320-kbps", "youtube-mp4-1080": "youtube-mp4-1080p" },
};

export const homeCopy: Record<Locale, HomeCopy> = {
  fr: {
    language: "Français", nativeName: "Français", dir: "ltr", ogLocale: "fr_FR",
    metaTitle: "Convertisseur vidéo MP3, MP4, WAV et plus | toTube",
    metaDescription: "Téléchargez et convertissez des vidéos publiques YouTube, TikTok, Instagram, Facebook et X en MP3, MP4, M4A, WAV, AAC, FLAC ou OPUS.",
    nav: ["Comment ça marche", "Plateformes", "Questions"], navCta: "Convertir une vidéo",
    eyebrow: "7 formats · 5 plateformes", title: "Convertisseur vidéo", accent: "universel.",
    subtitle: "Téléchargez et convertissez des vidéos publiques YouTube, TikTok, Instagram, Facebook et X dans le format adapté à votre appareil.",
    ad: "Publicité", ready: "Convertisseur prêt", private: "Confidentiel par défaut", paste: "Collez l’URL de votre vidéo",
    empty: "Collez un lien vidéo pour commencer.", inspect: "Rechercher", inspecting: "Analyse du lien…", convert: "Convertir maintenant", converting: "Conversion…",
    sample: "Essayez une vidéo Creative Commons", chooseFormat: "Choisissez un format", preparing: "Préparation du fichier", fileReady: "Votre fichier est prêt",
    download: "Télécharger", another: "Convertir un autre lien", readyToSave: "Prêt à être enregistré", trust: ["Liens publics", "Conversion rapide", "Sans inscription"],
    platformsKicker: "Plateformes compatibles", platformsTitle: "Un outil pour vos plateformes préférées.", platformsIntro: "Chaque guide explique les formats disponibles, les limites d’accès public et la meilleure méthode sur mobile ou ordinateur.", openTool: "Voir le guide",
    howKicker: "Comment ça marche", howTitle: "Trois étapes. Et c’est tout.", howIntro: "Collez un lien public, choisissez votre format, puis récupérez le fichier préparé.",
    steps: [{ title: "Collez le lien", text: "Copiez l’adresse publique de la vidéo depuis la plateforme." }, { title: "Choisissez le format", text: "MP4 pour la vidéo ou l’un de nos six formats audio." }, { title: "Téléchargez", text: "Enregistrez le fichier final sur votre téléphone ou ordinateur." }],
    faqKicker: "Bon à savoir", faqTitle: "Questions, réponses.", faqIntro: "Le contenu doit être public et vous devez être autorisé à le télécharger.",
    faqs: [
      { q: "Quelles plateformes sont prises en charge ?", a: "toTube traite les liens publics YouTube, TikTok, Instagram, Facebook, X, Vimeo, Dailymotion, Reddit et plusieurs autres services lorsque leur flux est accessible." },
      { q: "Quels formats puis-je choisir ?", a: "MP4 conserve la vidéo. MP3, M4A, WAV, AAC, FLAC et OPUS créent un fichier audio réel avec FFmpeg." },
      { q: "Puis-je télécharger une vidéo privée ?", a: "Non. toTube ne contourne pas les comptes privés, mots de passe, abonnements ou restrictions d’accès." },
      { q: "Pourquoi une conversion peut-elle échouer ?", a: "Une vidéo peut être privée, régionale, en direct, trop longue ou temporairement bloquée par la plateforme." },
    ],
    footerText: "Convertisseur multilingue pour les contenus que vous êtes autorisé à télécharger.", footerPlatforms: "Plateformes", footerFormats: "Formats", footerLanguages: "Langues", responsible: "Conçu pour une utilisation responsable.",
    errors: { empty: "Collez un lien vidéo pour commencer.", inspect: "Impossible d’analyser ce lien.", convert: "Cette conversion n’est pas disponible actuellement." },
  },
  en: {
    language: "English", nativeName: "English", dir: "ltr", ogLocale: "en_US",
    metaTitle: "Video converter for MP3, MP4, WAV and more | toTube",
    metaDescription: "Download and convert public YouTube, TikTok, Instagram, Facebook and X videos to MP3, MP4, M4A, WAV, AAC, FLAC or OPUS.",
    nav: ["How it works", "Platforms", "Questions"], navCta: "Convert a video",
    eyebrow: "7 formats · 5 platforms", title: "Universal video", accent: "converter.",
    subtitle: "Download and convert public videos from YouTube, TikTok, Instagram, Facebook and X into the right format for any device.",
    ad: "Advertisement", ready: "Converter ready", private: "Private by default", paste: "Paste your video URL",
    empty: "Paste a video link to get started.", inspect: "Find media", inspecting: "Checking link…", convert: "Convert now", converting: "Converting…",
    sample: "Try a Creative Commons sample", chooseFormat: "Choose a format", preparing: "Preparing your file", fileReady: "Your file is ready",
    download: "Download", another: "Convert another link", readyToSave: "Ready to save", trust: ["Public links", "Fast conversion", "No sign-up"],
    platformsKicker: "Supported platforms", platformsTitle: "One tool for your favorite platforms.", platformsIntro: "Each guide covers available formats, public-access limits and the easiest workflow on mobile or desktop.", openTool: "Open guide",
    howKicker: "How it works", howTitle: "Three steps. That’s it.", howIntro: "Paste a public link, select a format and download the prepared file.",
    steps: [{ title: "Paste the link", text: "Copy the public video address from the platform." }, { title: "Choose a format", text: "Use MP4 for video or select one of six audio formats." }, { title: "Download", text: "Save the finished file to your phone or computer." }],
    faqKicker: "Good to know", faqTitle: "Questions, answered.", faqIntro: "The media must be public and you must have permission to download it.",
    faqs: [
      { q: "Which platforms are supported?", a: "toTube handles public YouTube, TikTok, Instagram, Facebook, X, Vimeo, Dailymotion and Reddit links when a usable stream is available." },
      { q: "Which formats can I use?", a: "MP4 keeps the video. MP3, M4A, WAV, AAC, FLAC and OPUS create real audio files with FFmpeg." },
      { q: "Can I download private videos?", a: "No. toTube does not bypass private accounts, passwords, subscriptions or access restrictions." },
      { q: "Why can a conversion fail?", a: "A video may be private, region-locked, live, too long or temporarily restricted by the platform." },
    ],
    footerText: "A multilingual converter for media you are allowed to download.", footerPlatforms: "Platforms", footerFormats: "Formats", footerLanguages: "Languages", responsible: "Built for responsible creators.",
    errors: { empty: "Paste a video link to get started.", inspect: "We could not read that link.", convert: "This conversion is not available right now." },
  },
  ar: {
    language: "Arabic", nativeName: "العربية", dir: "rtl", ogLocale: "ar_AR",
    metaTitle: "محول فيديو MP3 وMP4 وWAV والمزيد | toTube",
    metaDescription: "نزّل وحوّل فيديوهات YouTube وTikTok وInstagram وFacebook وX العامة إلى MP3 أو MP4 أو M4A أو WAV أو AAC أو FLAC أو OPUS.",
    nav: ["طريقة الاستخدام", "المنصات", "الأسئلة"], navCta: "تحويل فيديو",
    eyebrow: "7 صيغ · 5 منصات", title: "محول فيديو", accent: "شامل.",
    subtitle: "نزّل وحوّل الفيديوهات العامة من YouTube وTikTok وInstagram وFacebook وX إلى الصيغة المناسبة لجهازك.",
    ad: "إعلان", ready: "المحول جاهز", private: "خصوصية افتراضية", paste: "ألصق رابط الفيديو",
    empty: "ألصق رابط فيديو للبدء.", inspect: "فحص الرابط", inspecting: "جارٍ فحص الرابط…", convert: "حوّل الآن", converting: "جارٍ التحويل…",
    sample: "جرّب فيديو Creative Commons", chooseFormat: "اختر الصيغة", preparing: "جارٍ إعداد الملف", fileReady: "ملفك جاهز",
    download: "تنزيل", another: "تحويل رابط آخر", readyToSave: "جاهز للحفظ", trust: ["روابط عامة", "تحويل سريع", "بدون تسجيل"],
    platformsKicker: "المنصات المدعومة", platformsTitle: "أداة واحدة لمنصاتك المفضلة.", platformsIntro: "يشرح كل دليل الصيغ المتاحة وحدود المحتوى العام وطريقة الاستخدام على الهاتف أو الكمبيوتر.", openTool: "عرض الدليل",
    howKicker: "طريقة الاستخدام", howTitle: "ثلاث خطوات فقط.", howIntro: "ألصق رابطاً عاماً، اختر الصيغة، ثم نزّل الملف الجاهز.",
    steps: [{ title: "ألصق الرابط", text: "انسخ رابط الفيديو العام من المنصة." }, { title: "اختر الصيغة", text: "اختر MP4 للفيديو أو واحدة من ست صيغ صوتية." }, { title: "نزّل الملف", text: "احفظ الملف النهائي على الهاتف أو الكمبيوتر." }],
    faqKicker: "معلومات مهمة", faqTitle: "أسئلة وأجوبة.", faqIntro: "يجب أن يكون المحتوى عاماً وأن تملك حق تنزيله.",
    faqs: [
      { q: "ما المنصات المدعومة؟", a: "يدعم toTube الروابط العامة من YouTube وTikTok وInstagram وFacebook وX وVimeo وDailymotion وReddit عندما يتوفر بث قابل للتحميل." },
      { q: "ما الصيغ المتاحة؟", a: "تحافظ MP4 على الفيديو، بينما تنشئ MP3 وM4A وWAV وAAC وFLAC وOPUS ملفات صوتية حقيقية عبر FFmpeg." },
      { q: "هل يمكن تنزيل فيديو خاص؟", a: "لا. لا يتجاوز toTube الحسابات الخاصة أو كلمات المرور أو الاشتراكات أو قيود الوصول." },
      { q: "لماذا قد يفشل التحويل؟", a: "قد يكون الفيديو خاصاً أو مقيداً جغرافياً أو بثاً مباشراً أو طويلاً جداً أو محظوراً مؤقتاً من المنصة." },
    ],
    footerText: "محول متعدد اللغات للمحتوى المسموح لك بتنزيله.", footerPlatforms: "المنصات", footerFormats: "الصيغ", footerLanguages: "اللغات", responsible: "مصمم للاستخدام المسؤول.",
    errors: { empty: "ألصق رابط فيديو للبدء.", inspect: "تعذر فحص هذا الرابط.", convert: "هذا التحويل غير متاح حالياً." },
  },
  es: {
    language: "Spanish", nativeName: "Español", dir: "ltr", ogLocale: "es_ES",
    metaTitle: "Convertidor de vídeo MP3, MP4, WAV y más | toTube",
    metaDescription: "Descarga y convierte vídeos públicos de YouTube, TikTok, Instagram, Facebook y X a MP3, MP4, M4A, WAV, AAC, FLAC u OPUS.",
    nav: ["Cómo funciona", "Plataformas", "Preguntas"], navCta: "Convertir vídeo",
    eyebrow: "7 formatos · 5 plataformas", title: "Convertidor de vídeo", accent: "universal.",
    subtitle: "Descarga y convierte vídeos públicos de YouTube, TikTok, Instagram, Facebook y X al formato adecuado para tu dispositivo.",
    ad: "Publicidad", ready: "Convertidor listo", private: "Privado por defecto", paste: "Pega la URL del vídeo",
    empty: "Pega un enlace de vídeo para empezar.", inspect: "Buscar vídeo", inspecting: "Analizando enlace…", convert: "Convertir ahora", converting: "Convirtiendo…",
    sample: "Prueba un vídeo Creative Commons", chooseFormat: "Elige un formato", preparing: "Preparando el archivo", fileReady: "Tu archivo está listo",
    download: "Descargar", another: "Convertir otro enlace", readyToSave: "Listo para guardar", trust: ["Enlaces públicos", "Conversión rápida", "Sin registro"],
    platformsKicker: "Plataformas compatibles", platformsTitle: "Una herramienta para tus plataformas favoritas.", platformsIntro: "Cada guía explica los formatos, los límites de acceso público y el proceso en móvil u ordenador.", openTool: "Ver guía",
    howKicker: "Cómo funciona", howTitle: "Tres pasos. Nada más.", howIntro: "Pega un enlace público, elige un formato y descarga el archivo preparado.",
    steps: [{ title: "Pega el enlace", text: "Copia la dirección pública del vídeo." }, { title: "Elige el formato", text: "MP4 para vídeo o uno de seis formatos de audio." }, { title: "Descarga", text: "Guarda el archivo final en tu dispositivo." }],
    faqKicker: "Información útil", faqTitle: "Preguntas y respuestas.", faqIntro: "El contenido debe ser público y debes tener permiso para descargarlo.",
    faqs: [{ q: "¿Qué plataformas son compatibles?", a: "toTube procesa enlaces públicos de YouTube, TikTok, Instagram, Facebook, X, Vimeo, Dailymotion y Reddit cuando existe un flujo accesible." }, { q: "¿Qué formatos puedo usar?", a: "MP4 mantiene el vídeo. MP3, M4A, WAV, AAC, FLAC y OPUS crean archivos de audio reales con FFmpeg." }, { q: "¿Puedo descargar vídeos privados?", a: "No. toTube no evita cuentas privadas, contraseñas, suscripciones ni restricciones." }, { q: "¿Por qué puede fallar una conversión?", a: "El vídeo puede ser privado, regional, en directo, demasiado largo o estar bloqueado temporalmente." }],
    footerText: "Convertidor multilingüe para contenido que puedes descargar legalmente.", footerPlatforms: "Plataformas", footerFormats: "Formatos", footerLanguages: "Idiomas", responsible: "Creado para un uso responsable.",
    errors: { empty: "Pega un enlace de vídeo para empezar.", inspect: "No hemos podido leer ese enlace.", convert: "Esta conversión no está disponible ahora." },
  },
  pt: {
    language: "Portuguese", nativeName: "Português", dir: "ltr", ogLocale: "pt_BR",
    metaTitle: "Conversor de vídeo MP3, MP4, WAV e mais | toTube",
    metaDescription: "Baixe e converta vídeos públicos do YouTube, TikTok, Instagram, Facebook e X para MP3, MP4, M4A, WAV, AAC, FLAC ou OPUS.",
    nav: ["Como funciona", "Plataformas", "Perguntas"], navCta: "Converter vídeo",
    eyebrow: "7 formatos · 5 plataformas", title: "Conversor de vídeo", accent: "universal.",
    subtitle: "Baixe e converta vídeos públicos do YouTube, TikTok, Instagram, Facebook e X no formato ideal para seu dispositivo.",
    ad: "Publicidade", ready: "Conversor pronto", private: "Privado por padrão", paste: "Cole a URL do vídeo",
    empty: "Cole um link de vídeo para começar.", inspect: "Buscar vídeo", inspecting: "Analisando link…", convert: "Converter agora", converting: "Convertendo…",
    sample: "Teste um vídeo Creative Commons", chooseFormat: "Escolha um formato", preparing: "Preparando o arquivo", fileReady: "Seu arquivo está pronto",
    download: "Baixar", another: "Converter outro link", readyToSave: "Pronto para salvar", trust: ["Links públicos", "Conversão rápida", "Sem cadastro"],
    platformsKicker: "Plataformas compatíveis", platformsTitle: "Uma ferramenta para suas plataformas favoritas.", platformsIntro: "Cada guia explica formatos, limites de acesso público e o processo no celular ou computador.", openTool: "Ver guia",
    howKicker: "Como funciona", howTitle: "Três passos. Só isso.", howIntro: "Cole um link público, escolha o formato e baixe o arquivo preparado.",
    steps: [{ title: "Cole o link", text: "Copie o endereço público do vídeo." }, { title: "Escolha o formato", text: "MP4 para vídeo ou um dos seis formatos de áudio." }, { title: "Baixe", text: "Salve o arquivo final no seu dispositivo." }],
    faqKicker: "Saiba mais", faqTitle: "Perguntas e respostas.", faqIntro: "O conteúdo deve ser público e você precisa ter permissão para baixá-lo.",
    faqs: [{ q: "Quais plataformas são compatíveis?", a: "O toTube processa links públicos do YouTube, TikTok, Instagram, Facebook, X, Vimeo, Dailymotion e Reddit quando há um fluxo acessível." }, { q: "Quais formatos posso usar?", a: "MP4 mantém o vídeo. MP3, M4A, WAV, AAC, FLAC e OPUS criam arquivos de áudio reais com FFmpeg." }, { q: "Posso baixar vídeos privados?", a: "Não. O toTube não contorna contas privadas, senhas, assinaturas ou restrições." }, { q: "Por que uma conversão pode falhar?", a: "O vídeo pode ser privado, regional, ao vivo, muito longo ou estar temporariamente bloqueado." }],
    footerText: "Conversor multilíngue para conteúdo que você pode baixar.", footerPlatforms: "Plataformas", footerFormats: "Formatos", footerLanguages: "Idiomas", responsible: "Criado para uso responsável.",
    errors: { empty: "Cole um link de vídeo para começar.", inspect: "Não foi possível ler esse link.", convert: "Esta conversão não está disponível agora." },
  },
  de: {
    language: "German", nativeName: "Deutsch", dir: "ltr", ogLocale: "de_DE",
    metaTitle: "Video-Konverter für MP3, MP4, WAV und mehr | toTube",
    metaDescription: "Öffentliche Videos von YouTube, TikTok, Instagram, Facebook und X als MP3, MP4, M4A, WAV, AAC, FLAC oder OPUS herunterladen.",
    nav: ["So funktioniert’s", "Plattformen", "Fragen"], navCta: "Video konvertieren",
    eyebrow: "7 Formate · 5 Plattformen", title: "Universeller", accent: "Video-Konverter.",
    subtitle: "Öffentliche Videos von YouTube, TikTok, Instagram, Facebook und X in das passende Format für jedes Gerät umwandeln.",
    ad: "Werbung", ready: "Konverter bereit", private: "Standardmäßig privat", paste: "Video-URL einfügen",
    empty: "Füge einen Videolink ein.", inspect: "Video suchen", inspecting: "Link wird geprüft…", convert: "Jetzt konvertieren", converting: "Konvertierung…",
    sample: "Creative-Commons-Video testen", chooseFormat: "Format auswählen", preparing: "Datei wird vorbereitet", fileReady: "Deine Datei ist bereit",
    download: "Herunterladen", another: "Anderen Link konvertieren", readyToSave: "Bereit zum Speichern", trust: ["Öffentliche Links", "Schnelle Konvertierung", "Ohne Anmeldung"],
    platformsKicker: "Unterstützte Plattformen", platformsTitle: "Ein Tool für deine Lieblingsplattformen.", platformsIntro: "Jeder Leitfaden erklärt Formate, Grenzen öffentlicher Inhalte und die Nutzung auf Handy oder Computer.", openTool: "Leitfaden öffnen",
    howKicker: "So funktioniert’s", howTitle: "Drei Schritte. Fertig.", howIntro: "Öffentlichen Link einfügen, Format auswählen und die fertige Datei laden.",
    steps: [{ title: "Link einfügen", text: "Kopiere die öffentliche Adresse des Videos." }, { title: "Format auswählen", text: "MP4 für Video oder eines von sechs Audioformaten." }, { title: "Herunterladen", text: "Speichere die fertige Datei auf deinem Gerät." }],
    faqKicker: "Gut zu wissen", faqTitle: "Fragen und Antworten.", faqIntro: "Der Inhalt muss öffentlich sein und du brauchst die Erlaubnis zum Download.",
    faqs: [{ q: "Welche Plattformen werden unterstützt?", a: "toTube verarbeitet öffentliche Links von YouTube, TikTok, Instagram, Facebook, X, Vimeo, Dailymotion und Reddit, wenn ein zugänglicher Stream verfügbar ist." }, { q: "Welche Formate gibt es?", a: "MP4 behält das Video. MP3, M4A, WAV, AAC, FLAC und OPUS erzeugen echte Audiodateien mit FFmpeg." }, { q: "Kann ich private Videos laden?", a: "Nein. toTube umgeht keine privaten Konten, Passwörter, Abos oder Zugriffsbeschränkungen." }, { q: "Warum kann eine Konvertierung scheitern?", a: "Das Video kann privat, regional gesperrt, live, zu lang oder vorübergehend blockiert sein." }],
    footerText: "Mehrsprachiger Konverter für Inhalte, die du herunterladen darfst.", footerPlatforms: "Plattformen", footerFormats: "Formate", footerLanguages: "Sprachen", responsible: "Für verantwortungsvolle Nutzung entwickelt.",
    errors: { empty: "Füge einen Videolink ein.", inspect: "Dieser Link konnte nicht gelesen werden.", convert: "Diese Konvertierung ist derzeit nicht verfügbar." },
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function platformForSlug(locale: Locale, slug: string): PlatformId | null {
  return platformIds.find((platform) => localizedSlugs[locale][platform] === slug) || null;
}

export function qualityPageForSlug(locale: Locale, slug: string): QualityPageId | null {
  return qualityPageIds.find((page) => localizedQualitySlugs[locale][page] === slug) || null;
}

export function localeHome(locale: Locale) {
  return `/${locale}`;
}

export function platformPath(locale: Locale, platform: PlatformId) {
  return `/${locale}/${localizedSlugs[locale][platform]}`;
}

export function qualityPagePath(locale: Locale, page: QualityPageId) {
  return `/${locale}/${localizedQualitySlugs[locale][page]}`;
}

export function languageAlternates(platform?: PlatformId) {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, `https://totube.online${platform ? platformPath(locale, platform) : localeHome(locale)}`]),
    ["x-default", `https://totube.online${platform ? platformPath("en", platform) : localeHome("en")}`],
  ]);
}

export function qualityLanguageAlternates(page: QualityPageId) {
  return Object.fromEntries([
    ...locales.map((locale) => [locale, `https://totube.online${qualityPagePath(locale, page)}`]),
    ["x-default", `https://totube.online${qualityPagePath("en", page)}`],
  ]);
}
