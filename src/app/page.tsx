import GoogleButton from "@/components/buttons/GoogleButton";
import AuthRedirect from "@/providers/AuthRedirect";

export default function Page() {
  return (
    <AuthRedirect>
      <GoogleButton />
    </AuthRedirect>
  );
}
