import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-facebook"];
export const metadata = definition.metadata;

export default function TelechargerVideoFacebookPage() {
  return <SeoLandingPage content={definition.content} />;
}
