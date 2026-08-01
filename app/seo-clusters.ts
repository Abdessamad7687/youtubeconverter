import type { Metadata } from "next";
import type { SeoPageContent } from "./seo-landing";

type SeoClusterDefinition = {
  metadata: Metadata;
  content: SeoPageContent;
};

const youtubeLinks = [
  { href: "/youtube-mp3", label: "YouTube MP3", text: "Créer un vrai fichier audio MP3 depuis une vidéo autorisée." },
  { href: "/youtube-mp4", label: "YouTube MP4", text: "Obtenir une vidéo H.264/AAC compatible jusqu’en 1080p." },
  { href: "/meilleur-telechargeur-video", label: "Guide des téléchargeurs", text: "Choisir le format et le service adaptés à votre appareil." },
];

const socialLinks = [
  { href: "/telecharger-video-tiktok", label: "Télécharger TikTok", text: "Préparer une vidéo TikTok publique en MP4." },
  { href: "/telecharger-video-instagram", label: "Télécharger Instagram", text: "Enregistrer un Reel ou une vidéo Instagram publique." },
  { href: "/telecharger-video-twitter", label: "Télécharger X / Twitter", text: "Convertir une vidéo ou animation X en MP4." },
];

function pageMetadata(slug: string, title: string, description: string, keywords: string[]): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://totube.online/${slug}` },
    openGraph: { title, description, url: `/${slug}`, locale: "fr_FR", type: "website" },
  };
}

export const seoClusters: Record<string, SeoClusterDefinition> = {
  "telecharger-video-youtube": {
    metadata: pageMetadata(
      "telecharger-video-youtube",
      "Télécharger une vidéo YouTube gratuitement en MP4 | toTube",
      "Téléchargez une vidéo YouTube publique en ligne, sans logiciel, au format MP4 jusqu’en 1080p avec toTube.",
      ["télécharger vidéo youtube", "télécharger vidéo youtube gratuit", "télécharger vidéo youtube sans logiciel", "télécharger vidéo youtube en ligne", "télécharger short youtube"],
    ),
    content: {
      slug: "telecharger-video-youtube",
      kicker: "Téléchargeur YouTube en ligne",
      title: "Télécharger une vidéo YouTube",
      accent: "gratuitement en MP4.",
      intro: "Collez le lien d’une vidéo YouTube publique que vous êtes autorisé à conserver et obtenez un MP4 compatible, sans installer de logiciel.",
      description: "Cette page rassemble le téléchargement YouTube vidéo : vidéos classiques, Shorts publics, usage sur iPhone, Android ou ordinateur et choix d’un MP4 réellement lisible.",
      benefits: [
        { title: "Sans logiciel", text: "Le traitement s’effectue en ligne depuis le navigateur, sur mobile comme sur ordinateur.", kind: "speed" },
        { title: "MP4 compatible", text: "La sortie privilégie H.264, AAC et yuv420p pour une lecture fiable.", kind: "video" },
        { title: "Liens publics", text: "Les contenus privés, protégés ou sans autorisation ne sont pas pris en charge.", kind: "safe" },
      ],
      sections: [
        { title: "Comment télécharger une vidéo YouTube sans logiciel ?", paragraphs: ["Copiez l’adresse complète de la vidéo ou du Short, collez-la dans le convertisseur puis lancez l’analyse. Choisissez MP4 pour conserver l’image et le son, ou MP3/M4A pour un usage audio autorisé.", "Le fichier final est préparé sur le serveur puis proposé par un bouton de téléchargement. Aucune extension de navigateur ni application mobile n’est nécessaire."] },
        { title: "MP4, HD, 1080p et compatibilité", paragraphs: ["toTube sélectionne la meilleure version compatible disponible jusqu’en Full HD 1080p. Le service ne promet pas actuellement le téléchargement 4K : cette limite évite des fichiers extrêmement lourds et des conversions interminables.", "Sur iPhone, Android, PC et Mac, H.264 avec audio AAC reste la combinaison la plus largement reconnue. Si la source utilise AV1 ou VP9, le fichier peut être réencodé pour améliorer sa lecture."] },
        { title: "Télécharger un Short ou une musique YouTube", paragraphs: ["Un Short public utilise le même processus qu’une vidéo classique : copiez son URL et choisissez MP4. Pour une piste audio, sélectionnez MP3 ou M4A uniquement lorsque vous possédez le contenu ou disposez d’une autorisation.", "Les playlists complètes ne sont pas téléchargées en masse. Traitez une vidéo à la fois afin de limiter les erreurs, les abus et les téléchargements non souhaités."] },
      ],
      faqs: [
        { question: "Puis-je télécharger une vidéo YouTube gratuitement ?", answer: "Oui, pour une vidéo publique que vous êtes autorisé à enregistrer. Des limites de durée, de taille et de fréquence protègent le service." },
        { question: "toTube télécharge-t-il les vidéos YouTube en 4K ?", answer: "Non. La qualité maximale actuelle est 1080p lorsque cette résolution est disponible." },
        { question: "Puis-je télécharger une playlist YouTube complète ?", answer: "Non. toTube traite une vidéo ou un Short à la fois et désactive les téléchargements de playlists en masse." },
        { question: "Cela fonctionne-t-il sur iPhone et Android ?", answer: "Oui. Le convertisseur fonctionne dans un navigateur récent et produit des fichiers MP4, MP3 ou M4A compatibles avec les appareils courants." },
      ],
      related: youtubeLinks,
    },
  },
  "telecharger-video-tiktok": {
    metadata: pageMetadata(
      "telecharger-video-tiktok",
      "Télécharger une vidéo TikTok en MP4 en ligne | toTube",
      "Téléchargez une vidéo TikTok publique en MP4 ou extrayez son audio, gratuitement et sans application.",
      ["télécharger vidéo tiktok", "télécharger vidéo tiktok sans filigrane", "télécharger tiktok sans watermark", "tiktok downloader gratuit", "télécharger vidéo tiktok hd"],
    ),
    content: {
      slug: "telecharger-video-tiktok",
      kicker: "TikTok downloader gratuit",
      title: "Télécharger une vidéo TikTok",
      accent: "en MP4, sans application.",
      intro: "Utilisez l’adresse d’une publication TikTok publique pour préparer un MP4 ou une piste audio depuis votre navigateur.",
      description: "Les liens TikTok courts et les publications classiques peuvent être transmis au convertisseur. La qualité et la présence d’un filigrane dépendent toujours du flux rendu disponible par TikTok.",
      benefits: [
        { title: "Lien TikTok", text: "Compatible avec les URL publiques TikTok et leurs liens mobiles de partage.", kind: "video" },
        { title: "MP4 ou audio", text: "Conservez la vidéo en MP4 ou préparez un MP3/M4A lorsque vous avez les droits.", kind: "audio" },
        { title: "Sans installation", text: "Aucune application supplémentaire n’est demandée sur iPhone, Android ou PC.", kind: "speed" },
      ],
      sections: [
        { title: "Comment télécharger une vidéo TikTok ?", paragraphs: ["Dans TikTok, utilisez Partager puis Copier le lien. Collez cette adresse dans toTube, attendez l’analyse et sélectionnez MP4. Le serveur récupère le meilleur flux public disponible et prépare le fichier.", "Pour télécharger seulement une musique ou une voix TikTok autorisée, choisissez MP3 ou M4A. La durée et la taille maximales restent limitées pour préserver la rapidité du service."] },
        { title: "TikTok sans filigrane : ce qu’il faut savoir", paragraphs: ["toTube n’ajoute aucun logo ni filigrane au fichier. Cependant, si TikTok fournit uniquement un flux contenant déjà un watermark, le service ne le masque pas et ne modifie pas l’image pour le supprimer.", "Cette distinction évite de promettre un résultat impossible : le fichier obtenu reflète la version techniquement accessible au moment de la conversion."] },
      ],
      faqs: [
        { question: "Le téléchargement TikTok est-il gratuit ?", answer: "Oui, dans les limites raisonnables du service et pour les contenus que vous êtes autorisé à conserver." },
        { question: "Le fichier sera-t-il sans watermark ?", answer: "toTube n’ajoute pas de watermark. Le résultat peut néanmoins conserver le filigrane présent dans le flux fourni par TikTok." },
        { question: "Puis-je télécharger une vidéo TikTok privée ?", answer: "Non. Seules les publications publiques accessibles sans connexion peuvent être traitées." },
      ],
      related: [socialLinks[1], socialLinks[2], youtubeLinks[2]],
    },
  },
  "telecharger-video-instagram": {
    metadata: pageMetadata(
      "telecharger-video-instagram",
      "Télécharger une vidéo ou un Reel Instagram | toTube",
      "Téléchargez un Reel, une story accessible ou une vidéo Instagram publique en MP4, sans application.",
      ["télécharger vidéo instagram", "télécharger reels instagram", "télécharger story instagram", "télécharger igtv", "instagram video downloader gratuit"],
    ),
    content: {
      slug: "telecharger-video-instagram",
      kicker: "Instagram video downloader",
      title: "Télécharger une vidéo Instagram",
      accent: "ou un Reel public.",
      intro: "Copiez le lien d’un Reel ou d’une publication vidéo Instagram publique et préparez un fichier MP4 compatible.",
      description: "Instagram regroupe Reels, vidéos de publications et stories temporaires. toTube traite les liens publics encore accessibles ; il ne contourne ni compte privé ni authentification.",
      benefits: [
        { title: "Reels publics", text: "Collez l’URL partagée d’un Reel encore disponible publiquement.", kind: "video" },
        { title: "MP4 lisible", text: "Le résultat vidéo est vérifié avant que le téléchargement soit proposé.", kind: "speed" },
        { title: "Respect de la confidentialité", text: "Aucun accès aux comptes privés, stories d’amis ou contenus restreints.", kind: "safe" },
      ],
      sections: [
        { title: "Télécharger un Reel Instagram en ligne", paragraphs: ["Ouvrez le Reel, utilisez le menu de partage puis copiez son lien. Dans toTube, collez l’adresse, lancez la recherche et choisissez MP4. Une fois le fichier préparé, le bouton Télécharger l’enregistre sur votre appareil.", "La même méthode s’applique aux publications vidéo publiques et aux anciennes vidéos IGTV disposant encore d’une URL accessible."] },
        { title: "Stories, photos et comptes privés", paragraphs: ["Une story ne peut être traitée que si son lien est encore public et disponible au moment de la demande. Une story expirée ou réservée aux abonnés ne peut pas être récupérée.", "Le convertisseur actuel est destiné aux médias audio et vidéo. Il ne propose pas de format JPG pour télécharger une photo Instagram isolée."] },
      ],
      faqs: [
        { question: "Puis-je télécharger un Reel sans application ?", answer: "Oui. Un navigateur récent suffit pour traiter un Reel public et récupérer son MP4." },
        { question: "Les stories Instagram sont-elles prises en charge ?", answer: "Seulement lorsqu’elles sont publiques, encore actives et accessibles au serveur sans connexion." },
        { question: "Puis-je accéder à un compte Instagram privé ?", answer: "Non. toTube ne contourne pas les comptes privés, les connexions ou les restrictions d’accès." },
      ],
      related: [socialLinks[0], socialLinks[2], youtubeLinks[2]],
    },
  },
  "telecharger-video-facebook": {
    metadata: pageMetadata(
      "telecharger-video-facebook",
      "Télécharger une vidéo Facebook publique en MP4 | toTube",
      "Téléchargez une vidéo Facebook publique en MP4 HD depuis votre navigateur, gratuitement et sans logiciel.",
      ["télécharger vidéo facebook", "télécharger vidéo facebook mp4", "télécharger vidéo facebook hd", "facebook video downloader gratuit"],
    ),
    content: {
      slug: "telecharger-video-facebook",
      kicker: "Facebook video downloader",
      title: "Télécharger une vidéo Facebook",
      accent: "publique en MP4.",
      intro: "Transformez le lien d’une publication vidéo Facebook publique en fichier MP4 compatible avec votre téléphone ou ordinateur.",
      description: "Facebook applique des niveaux de confidentialité différents à chaque publication. Le convertisseur accepte uniquement les vidéos visibles publiquement, sans compte ni cookie personnel.",
      benefits: [
        { title: "Vidéo publique", text: "Fonctionne avec les publications accessibles sans connexion Facebook.", kind: "safe" },
        { title: "Sortie MP4", text: "Vidéo et audio réunis dans un format largement reconnu.", kind: "video" },
        { title: "Depuis le navigateur", text: "Aucun logiciel Facebook downloader n’est à installer.", kind: "speed" },
      ],
      sections: [
        { title: "Comment télécharger une vidéo Facebook en MP4 ?", paragraphs: ["Affichez la publication vidéo, copiez son lien puis collez-le dans toTube. Après analyse, sélectionnez MP4 et attendez la préparation du fichier. La qualité dépend des versions SD ou HD rendues publiques par Facebook.", "Les liens raccourcis de partage peuvent être suivis lorsqu’ils mènent vers une publication publique valide."] },
        { title: "Pourquoi une vidéo Facebook privée est refusée", paragraphs: ["Une vidéo limitée aux amis, à un groupe fermé ou à un compte connecté nécessite une autorisation que toTube ne possède pas. Le service ne demande pas vos identifiants et ne contourne pas ces réglages.", "Si vous êtes l’auteur d’une vidéo privée, utilisez plutôt les outils d’exportation proposés dans votre propre compte Facebook."] },
      ],
      faqs: [
        { question: "Puis-je télécharger une vidéo Facebook privée ?", answer: "Non. Les vidéos privées, limitées aux amis ou publiées dans des groupes fermés ne sont pas accessibles." },
        { question: "La vidéo sera-t-elle en HD ?", answer: "toTube utilise la meilleure version publique compatible disponible, dans la limite de 1080p." },
        { question: "Dois-je communiquer mon compte Facebook ?", answer: "Non. Ne transmettez jamais vos identifiants : le service fonctionne uniquement avec des liens publics." },
      ],
      related: [socialLinks[0], socialLinks[1], socialLinks[2]],
    },
  },
  "telecharger-video-twitter": {
    metadata: pageMetadata(
      "telecharger-video-twitter",
      "Télécharger une vidéo Twitter / X en MP4 | toTube",
      "Téléchargez une vidéo X ou Twitter publique et convertissez un GIF animé en MP4 depuis votre navigateur.",
      ["télécharger vidéo twitter", "télécharger vidéo x", "twitter video downloader gratuit", "télécharger gif twitter"],
    ),
    content: {
      slug: "telecharger-video-twitter",
      kicker: "Twitter / X video downloader",
      title: "Télécharger une vidéo Twitter / X",
      accent: "gratuitement en MP4.",
      intro: "Collez l’adresse d’un post X public contenant une vidéo ou une animation et récupérez un fichier MP4.",
      description: "Les animations présentées comme des GIF sur X sont souvent diffusées sous forme de petites vidéos. toTube peut les conserver dans leur format MP4 réel, plus efficace qu’un GIF classique.",
      benefits: [
        { title: "Liens x.com et twitter.com", text: "Les deux générations d’URL publiques sont reconnues.", kind: "video" },
        { title: "GIF vers MP4", text: "Les animations vidéo de X sont enregistrées dans leur conteneur naturel.", kind: "speed" },
        { title: "Sans compte X", text: "Aucun identifiant n’est collecté ; les posts restreints sont refusés.", kind: "safe" },
      ],
      sections: [
        { title: "Comment télécharger une vidéo X ou Twitter ?", paragraphs: ["Ouvrez le post qui contient la vidéo, copiez son lien depuis le menu de partage et collez-le dans toTube. Choisissez MP4 pour conserver l’image et le son, puis téléchargez le fichier préparé.", "Les anciennes URL twitter.com et les nouvelles URL x.com sont traitées comme la même plateforme."] },
        { title: "Télécharger un GIF Twitter", paragraphs: ["X convertit fréquemment les GIF animés en vidéo MP4 afin de réduire leur taille. Le résultat téléchargé peut donc porter l’extension .mp4 même si l’interface de X affiche le mot GIF.", "Cette sortie se lit facilement dans un navigateur, un lecteur vidéo ou une application de montage récente."] },
      ],
      faqs: [
        { question: "toTube fonctionne-t-il avec x.com et twitter.com ?", answer: "Oui, pour les posts publics accessibles au moment de la conversion." },
        { question: "Pourquoi mon GIF devient-il un MP4 ?", answer: "X diffuse de nombreux GIF sous forme de vidéo. MP4 est alors le format source réel et offre généralement un fichier plus léger." },
        { question: "Les comptes protégés sont-ils pris en charge ?", answer: "Non. Les posts protégés, privés ou nécessitant une connexion ne peuvent pas être téléchargés." },
      ],
      related: [socialLinks[0], socialLinks[1], youtubeLinks[2]],
    },
  },
  "telecharger-video-autres-plateformes": {
    metadata: pageMetadata(
      "telecharger-video-autres-plateformes",
      "Télécharger une vidéo Vimeo, Dailymotion, Reddit et plus | toTube",
      "Un téléchargeur vidéo en ligne pour les liens publics Vimeo, Dailymotion, Reddit, Pinterest, Snapchat et LinkedIn.",
      ["télécharger vidéo pinterest", "télécharger vidéo snapchat", "télécharger vidéo vimeo", "télécharger vidéo dailymotion", "télécharger vidéo linkedin", "télécharger vidéo reddit"],
    ),
    content: {
      slug: "telecharger-video-autres-plateformes",
      kicker: "Autres plateformes vidéo",
      title: "Télécharger une vidéo en ligne",
      accent: "depuis plusieurs plateformes.",
      intro: "toTube reconnaît aussi des liens publics Vimeo, Dailymotion, Reddit, Pinterest, Snapchat et LinkedIn lorsque la plateforme expose un flux accessible.",
      description: "Cette page regroupe les plateformes à volume plus faible sans créer six pages presque identiques. Chaque service applique ses propres restrictions et peut modifier son fonctionnement sans préavis.",
      benefits: [
        { title: "Six plateformes", text: "Vimeo, Dailymotion, Reddit, Pinterest, Snapchat et LinkedIn réunis dans un guide.", kind: "video" },
        { title: "Détection automatique", text: "Collez le lien public : le moteur identifie le service et les formats disponibles.", kind: "speed" },
        { title: "Accès public uniquement", text: "Aucun mur de connexion, abonnement ou espace privé n’est contourné.", kind: "safe" },
      ],
      sections: [
        { title: "Vimeo et Dailymotion", paragraphs: ["Les vidéos Vimeo et Dailymotion publiques peuvent proposer plusieurs qualités. toTube sélectionne un flux compatible jusqu’en 1080p, puis vérifie le conteneur MP4 avant téléchargement.", "Les vidéos protégées par mot de passe, payantes, louées ou limitées à certains domaines restent indisponibles."] },
        { title: "Reddit et Pinterest", paragraphs: ["Pour Reddit, utilisez le lien direct de la publication contenant la vidéo. Pour Pinterest, copiez l’adresse de l’épingle vidéo. Les images fixes ne sont pas converties en MP4 et ne disposent pas d’un format photo dédié.", "Certaines vidéos Reddit séparent l’image et le son : le backend peut assembler les pistes lorsqu’elles sont publiquement accessibles."] },
        { title: "Snapchat et LinkedIn", paragraphs: ["Seuls les liens web publics Snapchat ou LinkedIn peuvent être analysés. Les stories privées, messages, espaces de formation et publications réservées à un compte ne sont pas accessibles.", "La compatibilité dépend fortement de la plateforme. Un message clair est affiché si aucun flux public téléchargeable n’est disponible."] },
      ],
      faqs: [
        { question: "Quelles autres plateformes sont compatibles ?", answer: "Les liens publics Vimeo, Dailymotion, Reddit, Pinterest, Snapchat et LinkedIn peuvent être essayés, selon les flux disponibles." },
        { question: "Puis-je télécharger une vidéo protégée par mot de passe ?", answer: "Non. toTube ne contourne pas les mots de passe, comptes privés, abonnements ou paiements." },
        { question: "Pourquoi certains liens publics échouent-ils ?", answer: "Les plateformes changent régulièrement leurs lecteurs, imposent des restrictions régionales ou ne fournissent aucun flux compatible au serveur." },
      ],
      related: [socialLinks[0], socialLinks[1], socialLinks[2]],
    },
  },
  "meilleur-telechargeur-video": {
    metadata: pageMetadata(
      "meilleur-telechargeur-video",
      "Meilleur téléchargeur vidéo en ligne gratuit en 2026 | toTube",
      "Comment choisir un site pour télécharger une vidéo gratuitement : formats réels, compatibilité, confidentialité et plateformes.",
      ["meilleur téléchargeur vidéo en ligne", "site pour télécharger vidéo gratuitement", "alternative à y2mate", "meilleur convertisseur youtube mp3 2026"],
    ),
    content: {
      slug: "meilleur-telechargeur-video",
      kicker: "Guide comparatif 2026",
      title: "Choisir le meilleur téléchargeur vidéo",
      accent: "en ligne et gratuit.",
      intro: "Un bon convertisseur ne se juge pas au nombre de boutons : il doit produire un vrai fichier, annoncer ses limites et protéger les visiteurs des faux téléchargements.",
      description: "Ce guide présente des critères vérifiables pour choisir un convertisseur YouTube MP3, un téléchargeur MP4 ou une alternative à Y2mate, sans classement publicitaire déguisé.",
      benefits: [
        { title: "Formats vérifiés", text: "Un vrai MP3 audio et un MP4 H.264/AAC, pas une extension simplement renommée.", kind: "audio" },
        { title: "Limites transparentes", text: "Qualité maximale, durée, plateformes et contenus privés clairement expliqués.", kind: "safe" },
        { title: "Expérience directe", text: "Une URL, un format et un téléchargement sans installation obligatoire.", kind: "speed" },
      ],
      sections: [
        { title: "Les critères d’un bon téléchargeur vidéo en 2026", paragraphs: ["Vérifiez d’abord que le service produit un fichier reconnu par les lecteurs courants. Pour le MP4, H.264, AAC et yuv420p restent des signaux de compatibilité ; pour le MP3, le fichier doit contenir une véritable piste audio encodée.", "Regardez ensuite les limites annoncées, la durée de conservation des fichiers et la présence d’un contact pour signaler les abus. Un outil crédible ne prétend pas accéder aux vidéos privées ou contourner toutes les protections."] },
        { title: "Alternative à Y2mate, noTube et autres convertisseurs", paragraphs: ["Les recherches d’alternative expriment souvent un besoin simple : moins de confusion, un fichier qui se lit et une interface adaptée au mobile. toTube se différencie par une vérification FFprobe et une conversion de compatibilité avec FFmpeg.", "toTube est indépendant de Y2mate, noTube, YouTube et des autres plateformes citées. Les marques appartiennent à leurs propriétaires respectifs."] },
        { title: "Quel format choisir : MP3, M4A ou MP4 ?", paragraphs: ["MP3 convient à l’audio universel, M4A offre une bonne efficacité et MP4 conserve la vidéo. Pour une lecture sur QuickTime, télévision ou ancien téléphone, un MP4 H.264/AAC est généralement le choix le plus sûr.", "Utilisez uniquement des médias que vous avez créés, qui sont proposés avec une licence adaptée ou que vous êtes légalement autorisé à télécharger."] },
      ],
      faqs: [
        { question: "Quel est le meilleur convertisseur YouTube MP3 en 2026 ?", answer: "Choisissez un service qui réalise un véritable encodage MP3, explique ses limites, fonctionne sur mobile et ne présente pas de faux bouton de téléchargement." },
        { question: "toTube est-il une alternative à Y2mate ?", answer: "Oui, toTube est un service indépendant qui propose MP3, M4A et MP4 avec son propre backend de conversion." },
        { question: "Quel site permet de télécharger une vidéo gratuitement ?", answer: "toTube traite plusieurs plateformes publiques sans inscription, avec des limites raisonnables de taille, de durée et de fréquence." },
      ],
      related: [
        { href: "/telecharger-video-youtube", label: "Télécharger YouTube", text: "Guide vidéo, Shorts, MP4 et usage sans logiciel." },
        { href: "/telecharger-video-tiktok", label: "Télécharger TikTok", text: "Liens publics TikTok en MP4 ou audio." },
        { href: "/telecharger-video-autres-plateformes", label: "Autres plateformes", text: "Vimeo, Dailymotion, Reddit, Pinterest et plus." },
      ],
    },
  },
};
