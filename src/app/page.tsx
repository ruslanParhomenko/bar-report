import GoogleButton from "@/components/buttons/GoogleButton";
import AuthRedirect from "@/providers/AuthRedirect";

const Page = () => {
  return (
    <AuthRedirect>
      <GoogleButton />
    </AuthRedirect>
  );
};

export default Page;
