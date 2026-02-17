import GoogleButton from "@/components/buttons/google-button";
import AuthRedirect from "@/providers/auth-redirect";

export default function Page() {
  return (
    <AuthRedirect>
      <GoogleButton />
    </AuthRedirect>
  );
}
