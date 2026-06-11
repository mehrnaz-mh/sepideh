import { getMediaFiles } from "@/actions/media";
import { MediaClient } from "./media-client";

export default async function AdminMediaPage() {
  const files = await getMediaFiles();
  return <MediaClient files={files} />;
}
