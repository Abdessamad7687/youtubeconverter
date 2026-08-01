import type { Metadata } from "next";
import { SeoLandingPage, type SeoPageContent } from "../seo-landing";

export const metadata: Metadata = {
  title: "YouTube MP4 — Télécharger une vidéo MP4 | toTube",
  description: "Convertisseur YouTube MP4 gratuit et rapide. Téléchargez vos vidéos autorisées en MP4 H.264 compatible, jusqu’en 1080p.",
  keywords: ["télécharger vidéo youtube mp4", "télécharger vidéo youtube gratuit", "télécharger vidéo youtube en ligne", "youtube downloader 4k", "télécharger short youtube"],
  alternates: { canonical: "https://totube.online/youtube-mp4" },
  openGraph: { title: "YouTube MP4 compatible — toTube", description: "Des vidéos MP4 H.264 et AAC compatibles avec tous vos appareils.", url: "/youtube-mp4" },
};

const content: SeoPageContent = {
  slug: "youtube-mp4",
  kicker: "Convertisseur YouTube MP4",
  title: "YouTube MP4",
  accent: "compatible partout.",
  intro: "Téléchargez une vidéo YouTube autorisée en MP4 H.264 avec son AAC, prête à être lue sur mobile, Mac, Windows et télévision.",
  description: "Tous les fichiers portant l’extension MP4 ne sont pas également compatibles. toTube privilégie H.264 et AAC et convertit automatiquement les flux AV1 ou VP9 lorsque votre lecteur risquerait de ne pas les reconnaître.",
  benefits: [
    { title: "Jusqu’en 1080p", text: "La meilleure résolution compatible disponible, limitée au Full HD.", kind: "video" },
    { title: "H.264 + AAC", text: "Des codecs universels pour QuickTime, Safari, Windows, Android et TV.", kind: "speed" },
    { title: "MP4 vérifié", text: "La vidéo finale est contrôlée avant de devenir disponible au téléchargement.", kind: "safe" },
  ],
  sections: [
    { title: "Comment télécharger une vidéo YouTube en MP4 ?", paragraphs: ["Copiez l’URL de la vidéo publique, collez-la dans toTube et sélectionnez le format MP4. Le service choisit une piste vidéo et une piste audio adaptées, les assemble puis vérifie le fichier final.", "Si YouTube fournit un codec récent comme AV1 qui n’est pas accepté par certains lecteurs, toTube le convertit en H.264 avec un profil couleur yuv420p largement compatible."] },
    { title: "Un MP4 conçu pour être lu partout", paragraphs: ["Le fichier est optimisé pour démarrer rapidement et utilise AAC pour le son. Cette combinaison évite le problème fréquent d’un MP4 téléchargé correctement mais impossible à lire dans QuickTime ou sur une télévision.", "La qualité dépend de la vidéo source. toTube conserve jusqu’à 1080p tout en donnant la priorité à la fiabilité de lecture et à une taille de fichier raisonnable."] },
    { title: "Shorts, Full HD et demandes 4K", paragraphs: ["Les liens YouTube Shorts publics sont traités comme les vidéos classiques et peuvent être préparés en MP4. Le service fonctionne sans logiciel sur iPhone, Android, PC et Mac.", "toTube limite actuellement la sortie à 1080p et ne se présente donc pas comme un YouTube downloader 4K. Cette limite réduit les temps d’attente, la consommation de bande passante et les risques de fichiers trop volumineux."] },
  ],
  faqs: [
    { question: "Pourquoi certains MP4 ne se lisent-ils pas ?", answer: "MP4 est un conteneur. Une vidéo MP4 peut contenir AV1 ou VP9, parfois incompatibles avec votre lecteur. toTube produit H.264 avec audio AAC." },
    { question: "Quelle est la qualité maximale ?", answer: "Le convertisseur vise jusqu’à 1080p lorsque cette résolution est proposée par la vidéo source." },
    { question: "Puis-je télécharger une vidéo YouTube en 4K ?", answer: "Non. La sortie est actuellement limitée à 1080p afin de préserver une conversion fiable et une taille raisonnable." },
    { question: "Le fichier contient-il bien la vidéo et le son ?", answer: "Oui. Les pistes vidéo et audio sont assemblées dans un seul fichier MP4 puis vérifiées avant téléchargement." },
  ],
};

export default function YoutubeMp4Page() { return <SeoLandingPage content={content} />; }
