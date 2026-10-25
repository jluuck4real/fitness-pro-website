import type { ComponentProps } from "react";
// Native document navigation avoids Vinext beta's production RSC prefetch bug.
// Same-origin transitions are enhanced by the View Transitions CSS API.
export default function SiteLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
