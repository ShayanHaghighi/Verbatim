import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  user_name: string;
  email: string;
  password: string;
}
// TODO change props from any typing
function SignUpForm(props: any) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
            console.log(error.response.data.message);
            console.log(error.response);
          }
        });
      // TODO navigate back to home page
      // navigate("/");
    } else {
      // TODO Change to send user valid warning
      console.log("please enter valid username/password");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user_name">User Name:</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {isLoading && <p>loading...</p>}
    </>
  );
}

export default SignUpForm;
