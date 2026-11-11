import { TextInput } from "./TextInput";

export default {
  Empty: <TextInput aria-label="Name" placeholder="Jane Doe" />,
  Filled: <TextInput aria-label="Name" defaultValue="Jane Doe" />,
  Invalid: <TextInput aria-label="Email" defaultValue="not-an-email" invalid />,
  Disabled: <TextInput aria-label="Name" defaultValue="Jane Doe" disabled />,
};
