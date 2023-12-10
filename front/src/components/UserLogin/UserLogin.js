import { useState } from "react";
import styles from "./UserLogin.module.css";
import axios from "../../axios.js";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userObject = {
      email: email,
      password: password,
    };
    try {
      const res = await axios.post("/users/signin", userObject);
    } catch (error) {
      console.error("LOGIN ERROR:", error.response.data.controller);
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <form className={styles.UserLogin} onSubmit={handleSubmit}>
      <label>Email:</label>
      <input
        id="input_email"
        type="email"
        name="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Hasło:</label>
      <input
        id="input_password"
        type="password"
        name="password"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="error-container">{errorMessage}</div>
      <button className="button-primary">Zaloguj się</button>
    </form>
  );
}

export default UserLogin;
