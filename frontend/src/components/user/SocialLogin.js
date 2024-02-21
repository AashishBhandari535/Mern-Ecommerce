import { useGoogleLogin } from "@react-oauth/google";

import { useGoogleLoginMutation } from "../../slices/userApiSlice";
import { useNavigate } from "react-router-dom";

import { FcGoogle } from "react-icons/fc";

// services
import { socialLoginService } from "../../services/authService";

export default function SocialLogin() {
  const navigate = useNavigate();
  const [socialLogin] = useGoogleLoginMutation();
  const socialLoginHandler = async (credentialResponse) => {
    socialLoginService(credentialResponse, socialLogin, navigate);
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
