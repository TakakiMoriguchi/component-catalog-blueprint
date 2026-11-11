import { Button } from "./Button";

// Follows the react-cosmos convention: default-export plain React elements.
// If you adopt react-cosmos later, this file works unchanged.
const noop = () => {};

export default {
  Primary: <Button onClick={noop}>Save</Button>,
  Secondary: (
    <Button variant="secondary" onClick={noop}>
      Cancel
    </Button>
  ),
  Danger: (
    <Button variant="danger" onClick={noop}>
      Delete
    </Button>
  ),
  Loading: (
    <Button loading loadingLabel="Saving..." onClick={noop}>
      Save
    </Button>
  ),
  Disabled: (
    <Button disabled onClick={noop}>
      Save
    </Button>
  ),
  Small: (
    <Button size="small" onClick={noop}>
      Save
    </Button>
  ),
  Large: (
    <Button size="large" onClick={noop}>
      Save
    </Button>
  ),
  "Full width": (
    <Button fullWidth onClick={noop}>
      Save
    </Button>
  ),
};
