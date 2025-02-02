import { SignUp } from '@clerk/nextjs';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: { session: null, signedIn: false },
  };
};

const SignUpPage = () => (
  <div className="m-auto">
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" afterSignUpUrl="/create-organization" />
  </div>
);

export default SignUpPage;
