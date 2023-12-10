import { useState } from "react";
import styles from "./UserRegister.module.css";
import axios from "../../axios.js";

function UserRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userObject = {
      name: name,
      email: email,
      password: password,
    };
    try {
      const res = await axios.post("/users/signup", userObject);
      console.log(res.data);
    } catch (error) {
      console.error("REGISTER ERROR:", error.response.data.controller);
      setErrorMessage(error.response.data.message.message);
    }
  };

  return (
    <form className={styles.UserRegister} onSubmit={handleSubmit}>
      <label>Imię:</label>
      <input
        id="input_name"
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <button className="button-primary">Zarejestruj się</button>
    </form>
  );
}

export default UserRegister;
