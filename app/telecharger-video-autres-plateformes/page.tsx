import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-autres-plateformes"];
export const metadata = definition.metadata;

export default function TelechargerVideoAutresPlateformesPage() {
  return <SeoLandingPage content={definition.content} />;
}
