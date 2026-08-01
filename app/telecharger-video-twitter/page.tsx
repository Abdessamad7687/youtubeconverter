import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-twitter"];
export const metadata = definition.metadata;

export default function TelechargerVideoTwitterPage() {
  return <SeoLandingPage content={definition.content} />;
}
