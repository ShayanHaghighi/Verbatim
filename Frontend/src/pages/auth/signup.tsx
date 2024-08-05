import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
  user_name: string;
  email: string;
  password: string;
}
// TODO change props from any typing
function SignUpForm(props: any) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setisError] = useState(<></>);
  const [hover, setHover] = useState(false);
  const [showingPassword, setShowingPassword] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    user_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!!formData.user_name && !!formData.email && !!formData.password) {
      setIsLoading(true);

      axios({
        method: "POST",
        url: "/api/signup",
        data: {
          username: formData.user_name,
          email: formData.email,
          password: formData.password,
        },
      })
        .then((response) => {
          props.setToken(response.data.access_token);
          navigate("/home");
        })
        .catch((error) => {
          if (error.response) {
            // TODO show this message to the user
            console.log(error.response.data.msg);
            console.log(error.response);
            if (
              error.response.data.msg == "User with that email already exists"
            ) {
              setisError(
                <span>
                  User with that email already exists, click{" "}
                  <span
                    // onMouseEnter={() => {
                    //   setHover(true);
                    //   console.log("hovering");
                    // }}
                    // onMouseLeave={() => {
                    //   setHover(false);
                    // }}
                    className="hover:underline cursor-pointer font-bold"
                    onClick={() => navigate(`/login?email=${formData.email}`)}
                  >
                    HERE
                  </span>{" "}
                  to log in
                </span>
              );
            } else {
              setisError(error.response.data.msg);
            }
            setIsLoading(false);
          }
        });
      // TODO navigate back to home page
      // navigate("/");
    } else {
      // TODO Change to send user valid warning
      console.log("please enter valid username/password");
      setisError(<span>please enter a username/password</span>);
    }
  };

  return (
    <>
      {isError.props.children && (
        <div className="error-box">
          <div>
            <strong>Error: </strong>
            {isError}{" "}
          </div>

          <span
            onClick={() => {
              setisError(<></>);
            }}
          >
            X
          </span>
        </div>
      )}
      <form
        className="mb-20 flex items-center flex-col justify-center w-2/3 max-w-4xl p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col items-start justify-center w-full m-4">
          <label
            className="mb-4 text-4xl font-bold text-blk"
            htmlFor="user_name"
          >
            User Name
          </label>
          <input
            className="w-full p-4 border border-gray-400 rounded-2xl h-16 bg-wht placeholder:text-xl text-xl text-blk"
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            placeholder="user name"
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full m-4">
          <label className="mb-4 text-4xl font-bold text-blk" htmlFor="email">
            Email
          </label>
          <input
            className="w-full p-4 border border-gray-400 rounded-2xl h-16 bg-wht placeholder:text-xl text-xl text-blk"
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
              className="mb-4 text-4xl font-bold text-blk"
              htmlFor="password"
            >
              Password
            </label>
            <span className="text-lg cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out">
              Forgot password?
            </span>
          </div>
          <div className="w-full relative">
            <input
              className="w-full p-4 border border-gray-400 rounded-2xl h-16 bg-wht placeholder:text-xl text-xl text-blk"
              type={showingPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="************"
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
        <div className="flex flex-col justify-center items-center">
          <span className="mt-8 text-lg text-blk">
            Already have an account?{" "}
            <span
              className="cursor-pointer font-bold text-purple hover:text-darkpurple transition-all duration-200 ease-in-out"
              onClick={() => navigate("/login")}
            >
              {" "}
              Log in
            </span>
          </span>
          <button className="btn-purple select-none" type="submit">
            Sign Up
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
    </>
  );
}

export default SignUpForm;
