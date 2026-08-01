import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-tiktok"];
export const metadata = definition.metadata;

export default function TelechargerVideoTiktokPage() {
  return <SeoLandingPage content={definition.content} />;
}
