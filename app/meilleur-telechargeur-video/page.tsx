import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["meilleur-telechargeur-video"];
export const metadata = definition.metadata;

export default function MeilleurTelechargeurVideoPage() {
  return <SeoLandingPage content={definition.content} />;
}
