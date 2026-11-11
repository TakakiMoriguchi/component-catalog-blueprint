import { LoginForm, type LoginFormProps } from "@/components/organisms/LoginForm";
import { CenteredLayout } from "@/components/templates/CenteredLayout";

export type LoginPageProps = LoginFormProps;

/** Template filled with real content. Data fetching stays outside, in the app. */
export function LoginPage(props: LoginPageProps) {
  return (
    <CenteredLayout title="Sign in">
      <LoginForm {...props} />
    </CenteredLayout>
  );
}
