import type { Metadata } from "next";
import { SeoLandingPage, type SeoPageContent } from "../seo-landing";

export const metadata: Metadata = {
  title: "Convertisseur MP3 gratuit en ligne | toTube",
  description: "Convertisseur MP3 gratuit pour transformer un lien vidéo autorisé en audio. Rapide, sans inscription et compatible avec tous vos appareils.",
  alternates: { canonical: "https://totube.online/convertisseur-mp3" },
  openGraph: { title: "Convertisseur MP3 gratuit — toTube", description: "Créez un vrai fichier MP3 compatible à partir d’un lien autorisé.", url: "/convertisseur-mp3" },
};

const content: SeoPageContent = {
  slug: "convertisseur-mp3",
  kicker: "Audio en ligne",
  title: "Convertisseur MP3",
  accent: "simple et fiable.",
  intro: "Convertissez un lien vidéo autorisé en véritable fichier MP3, avec une qualité équilibrée et une compatibilité maximale.",
  description: "Un bon convertisseur MP3 doit produire un fichier audio valide, conserver une qualité agréable et rester simple à utiliser. toTube réalise l’extraction et l’encodage côté serveur avec FFmpeg.",
  benefits: [
    { title: "Encodage réel", text: "La piste est convertie en MP3, jamais déguisée par un simple changement d’extension.", kind: "audio" },
    { title: "Métadonnées", text: "Le titre et les informations disponibles sont intégrés au fichier audio.", kind: "speed" },
    { title: "Fichiers temporaires", text: "Les conversions expirent automatiquement et ne forment pas une bibliothèque publique.", kind: "safe" },
  ],
  sections: [
    { title: "Que fait un convertisseur MP3 ?", paragraphs: ["Un convertisseur MP3 récupère la piste sonore d’un média puis l’encode avec un codec audio reconnu. Cette opération est différente du téléchargement d’une vidéo : elle retire l’image et produit un fichier plus léger destiné à l’écoute.", "toTube utilise FFmpeg pour générer le fichier final. Cela permet aux lecteurs audio de reconnaître correctement sa durée, son débit et ses métadonnées."] },
    { title: "MP3 ou M4A : que choisir ?", paragraphs: ["Le MP3 reste le meilleur choix lorsque la compatibilité est prioritaire. Il fonctionne avec les anciens autoradios, lecteurs portables, téléphones et logiciels de montage.", "Le M4A peut offrir une efficacité supérieure à taille équivalente. Il convient aux appareils modernes, tandis que le MP3 reste le format le plus rassurant pour partager ou archiver un contenu autorisé."] },
  ],
  faqs: [
    { question: "Quelle différence entre MP3 et MP4 ?", answer: "MP3 est un format audio. MP4 est un conteneur qui conserve généralement la vidéo et le son." },
    { question: "Pourquoi ne pas simplement renommer un fichier ?", answer: "Changer l’extension ne modifie pas le codec. Un encodage réel est nécessaire pour créer un fichier MP3 lisible." },
    { question: "Combien de temps le téléchargement reste-t-il disponible ?", answer: "Le backend conserve temporairement le résultat afin de permettre le téléchargement, puis le supprime automatiquement." },
  ],
};

export default function ConvertisseurMp3Page() { return <SeoLandingPage content={content} />; }
