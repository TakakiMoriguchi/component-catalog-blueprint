import { LoginForm } from "./LoginForm";

const noop = () => {};

export default {
  Default: <LoginForm onSubmit={noop} />,
  Loading: <LoginForm onSubmit={noop} loading />,
  "Server error": <LoginForm onSubmit={noop} error="Email or password is incorrect." />,
};
