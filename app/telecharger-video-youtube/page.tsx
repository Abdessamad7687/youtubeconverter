import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-youtube"];
export const metadata = definition.metadata;

export default function TelechargerVideoYoutubePage() {
  return <SeoLandingPage content={definition.content} />;
}
