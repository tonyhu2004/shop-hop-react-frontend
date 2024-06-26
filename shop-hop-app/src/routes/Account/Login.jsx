import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import InputField from "../../components/InputField.jsx";
import UserRepository from "../../repositories/UserRepository.js";
import PropTypes from "prop-types";

function Login({setIsAuthenticated}) {
    const accountRepository = new UserRepository()
    const emptyAccount = {
        email: "",
        password: "",
    };
    const [account, setAccount] = useState(emptyAccount);
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate();
    const handleChange = (name, value) => {
        setAccount((prev) => {
            return {
                ...prev, [name]: value
            }
        })
    }
    async function login(){
        return await accountRepository.Login(account)
            .catch(error => {
                console.error("Error logging in:", error);
            });
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const emptyField = Object.values(account).some(
            (value) => value === ""
        );
        if (emptyField){
            setErrorMessage("Login is not complete")
            setAccount(emptyAccount)
        }
        else{
            login()
                .then((responseData) =>{
                    console.log(responseData)
                    if (responseData) {
                        setErrorMessage("");
                        setIsAuthenticated(true);
                        localStorage.setItem('accessToken', responseData.accessToken);
                        localStorage.setItem('refreshToken', responseData.refreshToken);
                        navigate("/");
                        toast.success("logged in successfully!");
                    } else {
                        console.error("Offline error occurred");
                        setErrorMessage("Failed to login");
                    }
                })
                .catch((error) => {
                    console.error("login failed:", error);
                    setErrorMessage("Failed to login");
                });
        }
    }
    return (
        <div className="FormContainer">
            <form onSubmit={handleSubmit}>
                <InputField label="Email" type="text" cy="email"
                            value={account.email}
                            onChange={(value) => handleChange('email', value)}
                            />
                <InputField label="Password" type="password" cy="password"
                            value={account.password}
                            onChange={(value) => handleChange('password', value)}
                            />
                <p style={{color: "red", marginTop: 0}}>{errorMessage}</p>
                <button type="submit" data-cy="submit">Login</button>
            </form>
        </div>
    )
}

Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};
export default Login;