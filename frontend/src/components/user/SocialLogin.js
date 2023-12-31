import { useGoogleLogin } from "@react-oauth/google";

import { toast } from "react-toastify";
import { useGoogleLoginMutation } from "../../slices/userApiSlice";
import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

export default function SocialLogin() {
  const navigate = useNavigate();
  const [socialLogin] = useGoogleLoginMutation();
  const socialLoginHandler = async (credentialResponse) => {
    try {
      await socialLogin(credentialResponse);
      toast.success("Successfully LoggedIn");
      navigate("/me");
    } catch (err) {
      toast.error(err);
    }
  };
  const socialSignIn = useGoogleLogin({
    onSuccess: (res) => socialLoginHandler(res),
    onError: (err) => console.log(err),
    flow: "auth-code",
  });
  return (
    <div>
      <button className="btn btn-block py-3" onClick={() => socialSignIn()}>
        <FcGoogle />
        <span className="mx-3">Login with Google</span>
      </button>
    </div>
  );
}
