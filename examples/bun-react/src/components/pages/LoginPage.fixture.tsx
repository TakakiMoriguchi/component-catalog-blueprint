import { LoginPage } from "./LoginPage";

const noop = () => {};

export default {
  Default: <LoginPage onSubmit={noop} />,
  "Server error": <LoginPage onSubmit={noop} error="Email or password is incorrect." />,
};
