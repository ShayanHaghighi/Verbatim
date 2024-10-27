import { useState, ChangeEvent, FormEvent, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import "../../../node_modules/font-awesome/css/font-awesome.min.css";

import { useNavigate } from "react-router-dom";
// import "./styles.css";
import ErrorBar from "../../components/error-bar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TokenContext } from "../../App";
import { MdEmail, MdLock, MdOutlineEmail } from "react-icons/md";

interface FormData {
  email: string;
  password: string;
}
// TODO change props from any typing
function LoginForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setisError] = useState("");
  const [showingPassword, setShowingPassword] = useState(false);
  const { token, removeToken, setToken } = useContext(TokenContext);
  const [selectedId, setSelectedId] = useState<string | undefined>("");
  document.addEventListener("click", updateSelectedId);

  function updateSelectedId() {
    setSelectedId(document.activeElement?.id);
  }

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setFormData((prevForm) => ({ ...prevForm, email: email }));
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!formData.email && !!formData.password) {
      setIsLoading(true);
      axios({
        method: "POST",
        url: "/api/login",
        data: {
          email: formData.email,
          password: formData.password,
        },
      })
        .then((response) => {
          setToken(response.data.access_token);
          navigate("/home");
        })
        .catch((error) => {
          if (error.response) {
            // TODO show this message to the user
            console.log(error.response.data.message);
            console.log(error.response);
          }
        });
      // TODO navigate back to home page
    } else {
      // TODO Change to send user valid warning
      setisError("please enter a username/password");
      console.log("please enter valid username/password");
    }
  };

  return (
    <>
      {/* <div className="login-container"> */}
      <ErrorBar error={isError} setError={setisError} />
      <form
        onSubmit={handleSubmit}
        className="flex items-center flex-col justify-center w-2/3 max-w-4xl p-6 font-josefin sm:mt-0 mt-2 h-full"
      >
        <div className="text-6xl font-bold text-darkpurple">Log in</div>
        <span className="mt-8 text-sm xl:text-lg text-blk">
          Don't have an account?{" "}
          <span
            className="cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out"
            onClick={() => navigate("/signup")}
          >
            {" "}
            Sign in
          </span>
        </span>
        <div className="flex flex-col max-w-[40rem] items-start justify-center w-full m-4">
          <div className="relative flex items-center w-full">
            {!formData.email && selectedId != "email" && (
              <>
                <MdOutlineEmail className="absolute left-3 text-gray-400 w-5 h-auto text-zinc-400 pointer-events-none" />
                <span className="absolute left-11 text-zinc-400 pointer-events-none">
                  Email
                </span>
              </>
            )}
            <input
              className="w-full p-4 bg-zinc-200 rounded-sm h-16 text-md  text-black"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={updateSelectedId}
              placeholder=""
            />
          </div>
        </div>
        <div className="flex flex-col max-w-[40rem] items-start justify-center w-full m-4">
          <div className="w-full flex flex-row justify-between items-center">
            <span className="text-sm pb-4 sm:p-0 cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out w-full text-end">
              Forgot password?
            </span>
          </div>
          <div className="w-full  relative">
            <div className="relative flex items-center w-full">
              {!formData.password && selectedId != "password" && (
                <>
                  <MdLock className="absolute left-3 text-gray-400 pointer-events-none w-5 h-auto text-zinc-400" />
                  <span className="absolute left-11 text-zinc-400 pointer-events-none">
                    Password
                  </span>
                </>
              )}
              <input
                className="w-full  p-4 bg-zinc-200 rounded-sm h-16 text-md  text-black"
                type={showingPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onClick={updateSelectedId}
                onChange={handleChange}
              />
            </div>
            {showingPassword ? (
              <FaEyeSlash
                onClick={() => setShowingPassword(!showingPassword)}
                className="absolute top-1/2 right-6 w-6 h-auto -translate-y-2/4 select-none cursor-pointer text-black"
              />
            ) : (
              <FaEye
                onClick={() => setShowingPassword(!showingPassword)}
                className="absolute top-1/2 right-6 w-6 h-auto -translate-y-2/4 select-none cursor-pointer text-black"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center text-center">
          <button
            className="btn-purple text-[100%] w-1/2 min-w-52 bg-darkpurple hover:bg-purple mt-[9vh]"
            type="submit"
          >
            LOG IN
          </button>
          <span className="font-sm mt-4 text-blk">
            By continuing, you agree to our{" "}
            <span className=" text-purple  cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-purple cursor-pointer">Privacy Policy</span>{" "}
          </span>
        </div>
      </form>
      {isLoading && <p>loading...</p>}
      {/* </div> */}
    </>
  );
}

export default LoginForm;
