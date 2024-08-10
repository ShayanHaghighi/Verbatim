import { useState, ChangeEvent, FormEvent, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import { useNavigate } from "react-router-dom";
// import "./styles.css";
import ErrorBar from "../../components/error-bar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { TokenContext } from "../../App";

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
        className="mb-48 flex items-center flex-col justify-center w-2/3 max-w-4xl p-6"
      >
        <div className="flex flex-col items-start justify-center w-full m-4">
          <label
            className="mb-4 text-2xl sm:text-4xl font-bold text-blk"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="w-full p-4 border border-gray-400 rounded-2xl h-16 bg-wht text-md  text-blk"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full m-4">
          <div className="w-full flex flex-row justify-between items-center">
            <label
              className="mb-4 text-2xl sm:text-4xl  font-bold text-blk"
              htmlFor="password"
            >
              Password
            </label>
            <span className="text-sm ml-2 pb-4 sm:p-0 cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out text-end">
              Forgot password?
            </span>
          </div>
          <div className="w-full relative">
            <input
              className="w-full p-4 border border-gray-400 rounded-2xl h-16 bg-wht text-md sm:text-xl text-blk"
              type={showingPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="**********"
            />
            {showingPassword ? (
              <FaEyeSlash
                onClick={() => setShowingPassword(!showingPassword)}
                className="absolute top-1/2 right-6 w-6 h-auto -translate-y-2/4 select-none cursor-pointer text-blk"
              />
            ) : (
              <FaEye
                onClick={() => setShowingPassword(!showingPassword)}
                className="absolute top-1/2 right-6 w-6 h-auto -translate-y-2/4 select-none cursor-pointer text-blk"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center  text-center">
          <span className="mt-8 text-lg text-blk">
            Don't have an account?{" "}
            <span
              className="cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out"
              onClick={() => navigate("/signup")}
            >
              {" "}
              Sign in
            </span>
          </span>

          <button className="btn-purple select-none" type="submit">
            Log in
          </button>
          <span className="font-sm mt-4 text-blk">
            By continuing, you agree to our{" "}
            <span className=" text-purple cursor-pointer">
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
