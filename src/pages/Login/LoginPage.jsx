import { useState } from "react";
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const ApiKey = import.meta.env.VITE_API_KEY;

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Input validation
        if (!email.trim() || !password.trim()) {
            setError('Please enter both username and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${ApiKey}/auth/signin`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            if (data.token) {
                localStorage.setItem('accessToken', data.token);
                navigate('/home'); // Redirect to home page
            } else {
                throw new Error('No access token received');
            }

        } catch (error) {
            setError(error.message || 'An error occurred during login');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="App">
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleLogin}>
                <label>
                    <div className="wrap_input">
                        <p className="data">Email</p>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <p className="data">Password</p>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                </label>

                <div className="Wrapper">
                    <button
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log in!'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Login;