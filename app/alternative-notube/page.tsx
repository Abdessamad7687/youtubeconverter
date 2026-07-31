import type { Metadata } from "next";
import { SeoLandingPage, type SeoPageContent } from "../seo-landing";

export const metadata: Metadata = {
  title: "Alternative à noTube pour YouTube MP3 & MP4 | toTube",
  description: "Vous cherchez une alternative à noTube ? Découvrez toTube, un convertisseur YouTube MP3 et MP4 rapide, sans inscription et axé compatibilité.",
  alternates: { canonical: "https://clipmint-media.abdessamadahmali.chatgpt.site/alternative-notube" },
  openGraph: { title: "Alternative à noTube — toTube", description: "Une alternative claire pour convertir vos contenus autorisés en MP3, M4A ou MP4.", url: "/alternative-notube" },
};

const content: SeoPageContent = {
  slug: "alternative-notube",
  kicker: "Alternative noTube",
  title: "Une alternative à noTube",
  accent: "pensée pour la compatibilité.",
  intro: "toTube propose une autre manière de convertir les vidéos que vous êtes autorisé à télécharger : interface claire, vrais formats et MP4 compatibles.",
  description: "Les utilisateurs qui recherchent noTube veulent souvent un convertisseur direct, sans compte et disponible sur mobile. toTube répond à cette intention avec son propre moteur yt-dlp et FFmpeg et une attention particulière aux codecs de sortie.",
  benefits: [
    { title: "Trois formats", text: "MP3 et M4A pour l’audio, MP4 H.264/AAC pour la vidéo.", kind: "audio" },
    { title: "Lecture fiable", text: "Les flux vidéo incompatibles sont convertis automatiquement lorsque nécessaire.", kind: "video" },
    { title: "Sans bibliothèque", text: "Les fichiers restent temporaires et expirent après le téléchargement.", kind: "safe" },
  ],
  sections: [
    { title: "Pourquoi choisir une alternative à noTube ?", paragraphs: ["Un service de conversion doit surtout fournir un fichier qui fonctionne. toTube ne se limite pas à placer une vidéo dans un conteneur MP4 : le backend vérifie les codecs et privilégie H.264 et AAC pour une lecture très large.", "L’interface reste volontairement simple. Vous collez le lien, choisissez le format et confirmez vos droits d’utilisation avant la conversion."] },
    { title: "toTube, YouTube MP3 et YouTube MP4", paragraphs: ["Pour l’audio, le service effectue un véritable encodage MP3 ou M4A avec FFmpeg. Pour la vidéo, il assemble les pistes jusqu’en 1080p et convertit AV1 ou VP9 lorsque le lecteur cible risque de ne pas les accepter.", "toTube est un service indépendant et n’est ni affilié à noTube ni à YouTube. Les marques citées appartiennent à leurs propriétaires respectifs."] },
  ],
  faqs: [
    { question: "toTube est-il le même service que noTube ?", answer: "Non. toTube est un service indépendant avec sa propre interface et son propre backend de conversion." },
    { question: "Dois-je créer un compte ?", answer: "Non. L’interface de conversion ne demande pas d’inscription." },
    { question: "Quels formats sont disponibles ?", answer: "toTube prend en charge MP3, M4A et MP4. Les fichiers MP4 visent une compatibilité H.264 et AAC maximale." },
  ],
};

export default function AlternativeNotubePage() { return <SeoLandingPage content={content} />; }
