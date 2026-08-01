import { ArrowRight, Check, Download, FileAudio, FileVideo, Play, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { homeCopy, Locale, locales, PlatformId, platformIds, platformNames, platformPath } from "./i18n";

type LocaleSeo = {
  title: (platform: string) => string;
  accent: string;
  description: (platform: string) => string;
  guide: string;
  home: string;
  convert: string;
  free: string;
  noSignup: string;
  formats: string;
  publicTitle: string;
  publicText: (platform: string) => string;
  formatTitle: string;
  formatText: string;
  deviceTitle: string;
  deviceText: string;
  howTitle: (platform: string) => string;
  steps: (platform: string) => string;
  limitsTitle: string;
  limits: (platform: string) => string;
  questions: string;
  before: string;
  faqPublic: (platform: string) => string;
  faqPublicAnswer: (platform: string) => string;
  faqFormat: string;
  faqFormatAnswer: string;
  faqPrivate: string;
  faqPrivateAnswer: string;
  related: string;
  footer: string;
};

const seoUi: Record<Locale, LocaleSeo> = {
  fr: {
    title: (p) => `Télécharger une vidéo ${p}`, accent: "gratuitement et en ligne.", description: (p) => `Collez un lien ${p} public et convertissez la vidéo en MP4 ou dans l’un de nos six formats audio, sans installer de logiciel.`, guide: "Guide toTube", home: "Accueil", convert: "Convertir maintenant", free: "Gratuit", noSignup: "Sans inscription", formats: "7 formats", publicTitle: "Liens publics", publicText: (p) => `Analyse les contenus ${p} accessibles sans connexion.`, formatTitle: "Vidéo et audio", formatText: "MP4, MP3, M4A, WAV, AAC, FLAC et OPUS.", deviceTitle: "Tous les appareils", deviceText: "Fonctionne sur iPhone, Android, Windows, Mac et Linux.", howTitle: (p) => `Comment télécharger une vidéo ${p} ?`, steps: (p) => `Ouvrez la vidéo sur ${p}, copiez son lien de partage et collez-le dans toTube. Après l’analyse, choisissez MP4 pour conserver l’image ou un format audio pour extraire le son. Le fichier est préparé temporairement puis proposé au téléchargement.`, limitsTitle: "Accès public et limites", limits: (p) => `toTube ne demande pas vos identifiants ${p} et ne contourne pas les comptes privés, mots de passe, abonnements, restrictions régionales ou contenus supprimés. La qualité dépend du flux public fourni par la plateforme, avec une limite vidéo de 1080p.`, questions: "Questions fréquentes", before: "À savoir avant de convertir.", faqPublic: (p) => `Le téléchargeur ${p} est-il gratuit ?`, faqPublicAnswer: (p) => `Oui, le convertisseur ${p} est accessible sans inscription pour les liens publics compatibles.`, faqFormat: "Quels formats sont disponibles ?", faqFormatAnswer: "Vous pouvez choisir MP4, MP3, M4A, WAV, AAC, FLAC ou OPUS.", faqPrivate: "Puis-je télécharger un contenu privé ?", faqPrivateAnswer: "Non. Les contenus privés ou nécessitant une connexion ne sont pas accessibles.", related: "Autres plateformes", footer: "Convertisseur multilingue pour les contenus que vous êtes autorisé à télécharger.",
  },
  en: {
    title: (p) => `Download ${p} videos`, accent: "online for free.", description: (p) => `Paste a public ${p} link and convert the video to MP4 or one of six audio formats without installing software.`, guide: "toTube guide", home: "Home", convert: "Convert now", free: "Free", noSignup: "No sign-up", formats: "7 formats", publicTitle: "Public links", publicText: (p) => `Processes ${p} media available without signing in.`, formatTitle: "Video and audio", formatText: "MP4, MP3, M4A, WAV, AAC, FLAC and OPUS.", deviceTitle: "Every device", deviceText: "Works on iPhone, Android, Windows, Mac and Linux.", howTitle: (p) => `How to download a ${p} video`, steps: (p) => `Open the video on ${p}, copy its share link and paste it into toTube. After the link is checked, choose MP4 to keep the video or an audio format to extract the sound. The temporary file is then prepared for download.`, limitsTitle: "Public access and limits", limits: (p) => `toTube never asks for your ${p} login and does not bypass private accounts, passwords, subscriptions, regional blocks or deleted media. Quality depends on the public stream supplied by the platform and video output is limited to 1080p.`, questions: "Frequently asked questions", before: "What to know before converting.", faqPublic: (p) => `Is the ${p} downloader free?`, faqPublicAnswer: (p) => `Yes. The ${p} converter is available without an account for compatible public links.`, faqFormat: "Which formats are available?", faqFormatAnswer: "You can choose MP4, MP3, M4A, WAV, AAC, FLAC or OPUS.", faqPrivate: "Can I download private media?", faqPrivateAnswer: "No. Private media or content requiring a login is not accessible.", related: "Other platforms", footer: "A multilingual converter for media you are allowed to download.",
  },
  ar: {
    title: (p) => `تنزيل فيديو ${p}`, accent: "مجاناً عبر الإنترنت.", description: (p) => `ألصق رابط ${p} عاماً وحوّل الفيديو إلى MP4 أو إلى واحدة من ست صيغ صوتية بدون تثبيت برنامج.`, guide: "دليل toTube", home: "الرئيسية", convert: "حوّل الآن", free: "مجاني", noSignup: "بدون تسجيل", formats: "7 صيغ", publicTitle: "روابط عامة", publicText: (p) => `يعالج محتوى ${p} المتاح بدون تسجيل الدخول.`, formatTitle: "فيديو وصوت", formatText: "MP4 وMP3 وM4A وWAV وAAC وFLAC وOPUS.", deviceTitle: "كل الأجهزة", deviceText: "يعمل على iPhone وAndroid وWindows وMac وLinux.", howTitle: (p) => `كيفية تنزيل فيديو ${p}`, steps: (p) => `افتح الفيديو على ${p} وانسخ رابط المشاركة ثم ألصقه في toTube. بعد فحص الرابط اختر MP4 للاحتفاظ بالفيديو أو صيغة صوتية لاستخراج الصوت. يتم إعداد ملف مؤقت ثم يصبح جاهزاً للتنزيل.`, limitsTitle: "المحتوى العام والقيود", limits: (p) => `لا يطلب toTube بيانات دخول ${p} ولا يتجاوز الحسابات الخاصة أو كلمات المرور أو الاشتراكات أو الحظر الجغرافي أو المحتوى المحذوف. تعتمد الجودة على البث العام المتاح، بحد أقصى 1080p للفيديو.`, questions: "الأسئلة الشائعة", before: "معلومات قبل التحويل.", faqPublic: (p) => `هل أداة تنزيل ${p} مجانية؟`, faqPublicAnswer: (p) => `نعم، محول ${p} متاح بدون حساب للروابط العامة المتوافقة.`, faqFormat: "ما الصيغ المتاحة؟", faqFormatAnswer: "يمكنك اختيار MP4 أو MP3 أو M4A أو WAV أو AAC أو FLAC أو OPUS.", faqPrivate: "هل يمكن تنزيل محتوى خاص؟", faqPrivateAnswer: "لا. المحتوى الخاص أو الذي يحتاج إلى تسجيل الدخول غير متاح.", related: "منصات أخرى", footer: "محول متعدد اللغات للمحتوى المسموح لك بتنزيله.",
  },
  es: {
    title: (p) => `Descargar vídeos de ${p}`, accent: "gratis y online.", description: (p) => `Pega un enlace público de ${p} y convierte el vídeo a MP4 o a uno de seis formatos de audio sin instalar programas.`, guide: "Guía toTube", home: "Inicio", convert: "Convertir ahora", free: "Gratis", noSignup: "Sin registro", formats: "7 formatos", publicTitle: "Enlaces públicos", publicText: (p) => `Procesa contenido de ${p} accesible sin iniciar sesión.`, formatTitle: "Vídeo y audio", formatText: "MP4, MP3, M4A, WAV, AAC, FLAC y OPUS.", deviceTitle: "Todos los dispositivos", deviceText: "Funciona en iPhone, Android, Windows, Mac y Linux.", howTitle: (p) => `Cómo descargar un vídeo de ${p}`, steps: (p) => `Abre el vídeo en ${p}, copia el enlace para compartir y pégalo en toTube. Tras comprobarlo, elige MP4 para mantener el vídeo o un formato de audio para extraer el sonido. El archivo temporal quedará listo para descargar.`, limitsTitle: "Acceso público y límites", limits: (p) => `toTube no pide tu cuenta de ${p} ni evita perfiles privados, contraseñas, suscripciones, bloqueos regionales o contenido eliminado. La calidad depende del flujo público y el vídeo se limita a 1080p.`, questions: "Preguntas frecuentes", before: "Información antes de convertir.", faqPublic: (p) => `¿El descargador de ${p} es gratis?`, faqPublicAnswer: (p) => `Sí. El convertidor de ${p} funciona sin cuenta con enlaces públicos compatibles.`, faqFormat: "¿Qué formatos están disponibles?", faqFormatAnswer: "Puedes elegir MP4, MP3, M4A, WAV, AAC, FLAC u OPUS.", faqPrivate: "¿Puedo descargar contenido privado?", faqPrivateAnswer: "No. El contenido privado o que requiere inicio de sesión no es accesible.", related: "Otras plataformas", footer: "Convertidor multilingüe para contenido que puedes descargar legalmente.",
  },
  pt: {
    title: (p) => `Baixar vídeos do ${p}`, accent: "grátis e online.", description: (p) => `Cole um link público do ${p} e converta o vídeo para MP4 ou um dos seis formatos de áudio sem instalar programas.`, guide: "Guia toTube", home: "Início", convert: "Converter agora", free: "Grátis", noSignup: "Sem cadastro", formats: "7 formatos", publicTitle: "Links públicos", publicText: (p) => `Processa conteúdo do ${p} acessível sem login.`, formatTitle: "Vídeo e áudio", formatText: "MP4, MP3, M4A, WAV, AAC, FLAC e OPUS.", deviceTitle: "Todos os dispositivos", deviceText: "Funciona no iPhone, Android, Windows, Mac e Linux.", howTitle: (p) => `Como baixar um vídeo do ${p}`, steps: (p) => `Abra o vídeo no ${p}, copie o link de compartilhamento e cole no toTube. Depois da análise, escolha MP4 para manter o vídeo ou um formato de áudio para extrair o som. O arquivo temporário ficará pronto para baixar.`, limitsTitle: "Acesso público e limites", limits: (p) => `O toTube não pede seu login do ${p} nem contorna contas privadas, senhas, assinaturas, bloqueios regionais ou conteúdo removido. A qualidade depende do fluxo público e o vídeo é limitado a 1080p.`, questions: "Perguntas frequentes", before: "O que saber antes de converter.", faqPublic: (p) => `O downloader do ${p} é grátis?`, faqPublicAnswer: (p) => `Sim. O conversor do ${p} funciona sem conta para links públicos compatíveis.`, faqFormat: "Quais formatos estão disponíveis?", faqFormatAnswer: "Você pode escolher MP4, MP3, M4A, WAV, AAC, FLAC ou OPUS.", faqPrivate: "Posso baixar conteúdo privado?", faqPrivateAnswer: "Não. Conteúdo privado ou que exige login não está acessível.", related: "Outras plataformas", footer: "Conversor multilíngue para conteúdo que você pode baixar.",
  },
  de: {
    title: (p) => `${p}-Videos herunterladen`, accent: "kostenlos und online.", description: (p) => `Füge einen öffentlichen ${p}-Link ein und konvertiere das Video ohne Software in MP4 oder eines von sechs Audioformaten.`, guide: "toTube-Anleitung", home: "Startseite", convert: "Jetzt konvertieren", free: "Kostenlos", noSignup: "Ohne Anmeldung", formats: "7 Formate", publicTitle: "Öffentliche Links", publicText: (p) => `Verarbeitet ${p}-Inhalte, die ohne Anmeldung erreichbar sind.`, formatTitle: "Video und Audio", formatText: "MP4, MP3, M4A, WAV, AAC, FLAC und OPUS.", deviceTitle: "Alle Geräte", deviceText: "Funktioniert auf iPhone, Android, Windows, Mac und Linux.", howTitle: (p) => `So lädst du ein ${p}-Video herunter`, steps: (p) => `Öffne das Video auf ${p}, kopiere den Freigabelink und füge ihn in toTube ein. Wähle nach der Prüfung MP4 für das Video oder ein Audioformat für den Ton. Danach steht die temporäre Datei zum Download bereit.`, limitsTitle: "Öffentlicher Zugriff und Grenzen", limits: (p) => `toTube fragt nie nach deinem ${p}-Login und umgeht keine privaten Konten, Passwörter, Abos, regionalen Sperren oder gelöschten Inhalte. Die Qualität hängt vom öffentlichen Stream ab; Videos sind auf 1080p begrenzt.`, questions: "Häufige Fragen", before: "Wichtig vor der Konvertierung.", faqPublic: (p) => `Ist der ${p}-Downloader kostenlos?`, faqPublicAnswer: (p) => `Ja. Der ${p}-Konverter ist ohne Konto für kompatible öffentliche Links verfügbar.`, faqFormat: "Welche Formate gibt es?", faqFormatAnswer: "Du kannst MP4, MP3, M4A, WAV, AAC, FLAC oder OPUS wählen.", faqPrivate: "Kann ich private Inhalte laden?", faqPrivateAnswer: "Nein. Private Inhalte oder Medien mit Login-Pflicht sind nicht zugänglich.", related: "Weitere Plattformen", footer: "Mehrsprachiger Konverter für Inhalte, die du herunterladen darfst.",
  },
};

const platformSpecific: Record<Locale, Record<PlatformId, { title: string; text: string }>> = {
  fr: {
    youtube: { title: "YouTube, Shorts et musique", text: "Les vidéos classiques et Shorts publics sont pris en charge. Une URL de playlist traite une seule vidéo à la fois afin de limiter la charge et de garder un téléchargement clair." },
    tiktok: { title: "TikTok et filigrane", text: "toTube n’ajoute aucun filigrane. Si la version publique fournie par TikTok contient déjà un logo ou le nom du créateur, celui-ci reste dans le fichier final." },
    instagram: { title: "Reels, vidéos et stories", text: "Les Reels et publications vidéo publiques peuvent être traités. Les stories expirées, comptes privés et photos seules ne sont pas récupérables par le convertisseur vidéo." },
    facebook: { title: "Publications Facebook publiques", text: "Les vidéos visibles sans compte sont compatibles. Les groupes fermés, publications réservées aux amis et vidéos privées restent inaccessibles." },
    twitter: { title: "Vidéos X et GIF", text: "X diffuse souvent les GIF animés sous forme de MP4. Le fichier final peut donc être une vidéo MP4 légère même lorsque le post affiche le mot GIF." },
  },
  en: {
    youtube: { title: "YouTube videos, Shorts and music", text: "Public standard videos and Shorts are supported. Playlist links process one video at a time to keep jobs fast and downloads predictable." },
    tiktok: { title: "TikTok and watermarks", text: "toTube never adds a watermark. If TikTok supplies a public stream that already contains a logo or creator name, it remains in the finished file." },
    instagram: { title: "Reels, videos and stories", text: "Public Reels and video posts may be processed. Expired stories, private accounts and standalone photos are not available through the video converter." },
    facebook: { title: "Public Facebook posts", text: "Videos viewable without an account are supported. Closed groups, friends-only posts and private videos remain inaccessible." },
    twitter: { title: "X videos and GIFs", text: "X often delivers animated GIFs as MP4 video. The downloaded file may therefore be a lightweight MP4 even when the post labels it as a GIF." },
  },
  ar: {
    youtube: { title: "فيديوهات YouTube وShorts والموسيقى", text: "يدعم toTube الفيديوهات العامة وShorts. تتم معالجة فيديو واحد فقط من رابط قائمة التشغيل لتسريع الخدمة وتوضيح عملية التنزيل." },
    tiktok: { title: "TikTok والعلامة المائية", text: "لا يضيف toTube علامة مائية. إذا كان البث العام من TikTok يحتوي أصلاً على شعار أو اسم صاحب الفيديو فسيبقى في الملف." },
    instagram: { title: "Reels والفيديوهات والقصص", text: "يمكن معالجة Reels والمنشورات العامة. القصص المنتهية والحسابات الخاصة والصور المنفردة غير متاحة في محول الفيديو." },
    facebook: { title: "منشورات Facebook العامة", text: "يمكن تنزيل الفيديوهات المرئية بدون حساب. المجموعات المغلقة والمنشورات المخصصة للأصدقاء والفيديوهات الخاصة غير متاحة." },
    twitter: { title: "فيديوهات X وGIF", text: "يعرض X كثيراً من صور GIF المتحركة كفيديو MP4، لذلك قد يكون الملف النهائي MP4 خفيفاً حتى عندما يظهر في المنشور كصورة GIF." },
  },
  es: {
    youtube: { title: "Vídeos, Shorts y música de YouTube", text: "Se admiten vídeos públicos y Shorts. Los enlaces de listas procesan un vídeo cada vez para mantener conversiones rápidas y claras." },
    tiktok: { title: "TikTok y marcas de agua", text: "toTube no añade marcas de agua. Si el flujo público de TikTok ya incluye un logo o nombre de creador, seguirá presente en el archivo." },
    instagram: { title: "Reels, vídeos e historias", text: "Se pueden procesar Reels y publicaciones públicas. Las historias caducadas, cuentas privadas y fotos sueltas no están disponibles." },
    facebook: { title: "Publicaciones públicas de Facebook", text: "Los vídeos visibles sin cuenta son compatibles. Los grupos cerrados, publicaciones para amigos y vídeos privados no lo son." },
    twitter: { title: "Vídeos y GIF de X", text: "X suele entregar los GIF animados como vídeo MP4. El archivo final puede ser un MP4 ligero aunque la publicación lo llame GIF." },
  },
  pt: {
    youtube: { title: "Vídeos, Shorts e música do YouTube", text: "Vídeos públicos e Shorts são compatíveis. Links de playlists processam um vídeo por vez para manter o serviço rápido e previsível." },
    tiktok: { title: "TikTok e marca d’água", text: "O toTube não adiciona marca d’água. Se o fluxo público do TikTok já tiver logo ou nome do criador, ele permanecerá no arquivo." },
    instagram: { title: "Reels, vídeos e stories", text: "Reels e posts públicos podem ser processados. Stories expirados, contas privadas e fotos isoladas não estão disponíveis." },
    facebook: { title: "Posts públicos do Facebook", text: "Vídeos visíveis sem conta são compatíveis. Grupos fechados, posts só para amigos e vídeos privados não são acessíveis." },
    twitter: { title: "Vídeos e GIFs do X", text: "O X geralmente entrega GIFs animados como vídeo MP4. O arquivo final pode ser um MP4 leve mesmo quando o post mostra a palavra GIF." },
  },
  de: {
    youtube: { title: "YouTube-Videos, Shorts und Musik", text: "Öffentliche Videos und Shorts werden unterstützt. Playlist-Links verarbeiten jeweils ein Video, damit Aufträge schnell und übersichtlich bleiben." },
    tiktok: { title: "TikTok und Wasserzeichen", text: "toTube fügt kein Wasserzeichen hinzu. Enthält der öffentliche TikTok-Stream bereits Logo oder Creator-Name, bleiben diese in der Datei." },
    instagram: { title: "Reels, Videos und Storys", text: "Öffentliche Reels und Videobeiträge können verarbeitet werden. Abgelaufene Storys, private Konten und einzelne Fotos sind nicht verfügbar." },
    facebook: { title: "Öffentliche Facebook-Beiträge", text: "Videos, die ohne Konto sichtbar sind, werden unterstützt. Geschlossene Gruppen, Beiträge nur für Freunde und private Videos nicht." },
    twitter: { title: "X-Videos und GIFs", text: "X liefert animierte GIFs häufig als MP4-Video. Deshalb kann der Download ein kleines MP4 sein, auch wenn der Beitrag es als GIF bezeichnet." },
  },
};

export function platformMetadataText(locale: Locale, platform: PlatformId) {
  const ui = seoUi[locale];
  const name = platformNames[platform];
  return {
    title: `${ui.title(name)} — ${ui.accent.replace(/\.$/, "")} | toTube`,
    description: ui.description(name),
  };
}

export function LocalizedPlatformPage({ locale, platform }: { locale: Locale; platform: PlatformId }) {
  const ui = seoUi[locale];
  const copy = homeCopy[locale];
  const name = platformNames[platform];
  const canonical = `https://totube.online${platformPath(locale, platform)}`;
  const faqs = [
    { question: ui.faqPublic(name), answer: ui.faqPublicAnswer(name) },
    { question: ui.faqFormat, answer: ui.faqFormatAnswer },
    { question: ui.faqPrivate, answer: ui.faqPrivateAnswer },
  ];
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: ui.home, item: `https://totube.online/${locale}` }, { "@type": "ListItem", position: 2, name: ui.title(name), item: canonical }] };

  return (
    <main className="seo-page" dir={copy.dir}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="site-header seo-header">
        <Link href={`/${locale}`} className="brand" aria-label="toTube"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></Link>
        <nav className="locale-inline" aria-label="Languages">{locales.map((code) => <Link key={code} href={platformPath(code, platform)} hrefLang={code} aria-current={code === locale ? "page" : undefined}>{code.toUpperCase()}</Link>)}</nav>
        <Link className="nav-cta" href={`/${locale}#converter`}>{ui.convert} <ArrowRight size={15} /></Link>
      </header>

      <section className="seo-hero">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href={`/${locale}`}>{ui.home}</Link><span>/</span><span>{name}</span></nav>
        <span className="section-kicker">{name} downloader</span>
        <h1>{ui.title(name)}<br /><em>{ui.accent}</em></h1>
        <p>{ui.description(name)}</p>
        <Link href={`/${locale}#converter`} className="seo-primary-cta">{ui.convert} <ArrowRight size={18} /></Link>
        <div className="seo-trust"><span><Check size={15} /> {ui.free}</span><span><Check size={15} /> {ui.noSignup}</span><span><Check size={15} /> {ui.formats}</span></div>
      </section>

      <section className="seo-benefits" aria-label="Benefits">
        <article><span><ShieldCheck /></span><h2>{ui.publicTitle}</h2><p>{ui.publicText(name)}</p></article>
        <article><span><FileVideo /></span><h2>{ui.formatTitle}</h2><p>{ui.formatText}</p></article>
        <article><span><Zap /></span><h2>{ui.deviceTitle}</h2><p>{ui.deviceText}</p></article>
      </section>

      <article className="seo-article">
        <div className="seo-article-intro"><span className="section-kicker">{ui.guide}</span><p>{ui.description(name)}</p></div>
        <div className="seo-copy">
          <section><h2>{ui.howTitle(name)}</h2><p>{ui.steps(name)}</p></section>
          <section><h2>{platformSpecific[locale][platform].title}</h2><p>{platformSpecific[locale][platform].text}</p></section>
          <section><h2>{ui.limitsTitle}</h2><p>{ui.limits(name)}</p></section>
          <aside className="seo-callout"><span><FileAudio /></span><div><strong>{copy.chooseFormat}</strong><p>MP3 · MP4 · M4A · WAV · AAC · FLAC · OPUS</p></div><Link href={`/${locale}#converter`}>{ui.convert} <ArrowRight size={15} /></Link></aside>
        </div>
      </article>

      <section className="seo-faq"><div><span className="section-kicker">{ui.questions}</span><h2>{ui.before}</h2></div><div className="seo-faq-list">{faqs.map((faq, index) => <details key={faq.question} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

      <section className="related-section"><span className="section-kicker">{ui.related}</span><h2>{ui.related}</h2><div>{platformIds.filter((item) => item !== platform).slice(0, 3).map((item) => <Link href={platformPath(locale, item)} key={item}><strong>{platformNames[item]}</strong><p>{ui.description(platformNames[item])}</p><ArrowRight size={17} /></Link>)}</div></section>

      <footer className="seo-footer"><Link href={`/${locale}`} className="brand"><span className="brand-mark"><Play size={15} fill="currentColor" /></span><span>totube</span></Link><p>{ui.footer}</p><Link href={`/${locale}#converter`}><Download size={15} /> {ui.convert}</Link></footer>
    </main>
  );
}
