import { SeoLandingPage } from "../seo-landing";
import { seoClusters } from "../seo-clusters";

const definition = seoClusters["telecharger-video-instagram"];
export const metadata = definition.metadata;

export default function TelechargerVideoInstagramPage() {
  return <SeoLandingPage content={definition.content} />;
}
