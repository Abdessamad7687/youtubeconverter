import type { Metadata } from "next";
import { SeoLandingPage, type SeoPageContent } from "../seo-landing";

export const metadata: Metadata = {
  title: "YouTube MP3 gratuit — Convertir YouTube en MP3 | toTube",
  description: "Convertissez une vidéo YouTube en MP3 gratuitement avec toTube. Un convertisseur YouTube MP3 rapide, simple et sans inscription.",
  keywords: ["convertisseur youtube mp3", "youtube vers mp3 gratuit", "télécharger musique youtube", "meilleur convertisseur youtube mp3 2026"],
  alternates: { canonical: "https://totube.online/youtube-mp3" },
  openGraph: { title: "YouTube MP3 gratuit — toTube", description: "Transformez une vidéo YouTube autorisée en fichier MP3.", url: "/youtube-mp3" },
};

const content: SeoPageContent = {
  slug: "youtube-mp3",
  kicker: "Convertisseur YouTube MP3",
  title: "YouTube MP3",
  accent: "gratuit et rapide.",
  intro: "Transformez une vidéo YouTube autorisée en fichier audio MP3 compatible avec votre téléphone, votre ordinateur et votre autoradio.",
  description: "Le format MP3 reste le choix le plus universel pour écouter un contenu audio hors ligne. toTube prépare un fichier propre avec ses métadonnées, sans imposer la création d’un compte.",
  benefits: [
    { title: "MP3 universel", text: "Un fichier lisible sur presque tous les appareils et lecteurs audio.", kind: "audio" },
    { title: "Conversion rapide", text: "Une interface directe : un lien, un format et un téléchargement.", kind: "speed" },
    { title: "Utilisation responsable", text: "Réservé aux vidéos que vous avez créées ou êtes autorisé à enregistrer.", kind: "safe" },
  ],
  sections: [
    { title: "Comment convertir YouTube en MP3 ?", paragraphs: ["Copiez l’adresse de la vidéo YouTube publique, ouvrez le convertisseur toTube et collez le lien dans le champ prévu. Après l’analyse, sélectionnez MP3 puis confirmez que vous disposez des droits nécessaires.", "Le backend extrait la piste audio et l’encode réellement en MP3. Le résultat n’est pas une vidéo simplement renommée : c’est un fichier audio valide avec une excellente compatibilité."] },
    { title: "Pourquoi choisir le format MP3 ?", paragraphs: ["Le MP3 offre un bon équilibre entre qualité, taille et compatibilité. Il convient aux interviews, cours, podcasts, mémos et autres contenus parlés que vous êtes autorisé à conserver.", "Pour une meilleure efficacité audio, le format M4A est aussi disponible. Si vous souhaitez conserver l’image, choisissez plutôt le convertisseur YouTube MP4."] },
    { title: "Choisir un convertisseur YouTube MP3 en 2026", paragraphs: ["Un bon convertisseur doit produire une véritable piste MP3, annoncer ses limites et fonctionner sans faux bouton de téléchargement. toTube utilise FFmpeg pour encoder l’audio et vérifie que le fichier final existe avant de le proposer.", "Télécharger une musique YouTube reste soumis aux droits du créateur et aux conditions de la plateforme. Utilisez cette fonction pour vos propres créations, les licences compatibles ou les contenus pour lesquels vous avez reçu une autorisation."] },
  ],
  faqs: [
    { question: "Le convertisseur YouTube MP3 est-il gratuit ?", answer: "Oui. toTube permet de préparer un MP3 sans inscription. Des limites raisonnables protègent la disponibilité du service." },
    { question: "Le fichier téléchargé est-il un vrai MP3 ?", answer: "Oui. La piste audio est extraite puis encodée par FFmpeg au format MP3 ; elle n’est pas seulement renommée." },
    { question: "Puis-je convertir toutes les vidéos YouTube ?", answer: "Non. Les vidéos privées, protégées, en direct ou trop longues peuvent être refusées. Vous devez également disposer du droit de télécharger le contenu." },
  ],
};

export default function YoutubeMp3Page() { return <SeoLandingPage content={content} />; }
