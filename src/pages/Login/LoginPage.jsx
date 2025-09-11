import {useState} from "react";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';


function Login(){

    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const navigate = useNavigate();


    const ApiKey = import.meta.env.VITE_API_KEY;

    const login = () => {
        fetch(`${ApiKey}/login`, {
            method: 'POST',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Login failed');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                // Check if the response contains a redirect URL or a success indicator
                if (data.redirectUrl) {
                    navigate(data.redirectUrl); // Redirect to the specified URL
                } else {
                    // If you don't have a redirect URL, you can redirect to a default route
                    navigate('/'); // Redirect to home or another route
                }
            })
            .catch((error) => console.error(error));
    }


    return(
        <div className="App">
            <label htmlFor="">
                <div className="wrap_input">
                    Username <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    Password <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
            </label>


            <div className="Wrapper">
                <button onClick={login}>Log in!</button>
            </div>
        </div>
    )
}

export default Login;