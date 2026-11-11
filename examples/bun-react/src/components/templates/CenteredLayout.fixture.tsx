import { CenteredLayout } from "./CenteredLayout";

// Templates show structure, so fixtures fill the slots with placeholders.
const placeholder = (
  <div style={{ height: 120, border: "2px dashed #c9c9c9", borderRadius: 6, display: "grid", placeItems: "center" }}>
    Content
  </div>
);

export default {
  "With placeholder": <CenteredLayout title="Title">{placeholder}</CenteredLayout>,
};
