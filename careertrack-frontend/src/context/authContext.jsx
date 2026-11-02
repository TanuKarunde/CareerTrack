import { createContext, useContext, useState } from "react";

const authContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("careertrack_user");

        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {

        localStorage.setItem("careertrack_user",JSON.stringify(userData));

        localStorage.setItem("careertrack_token",userData.token);

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("careertrack_user");

        localStorage.removeItem("careertrack_token");

        setUser(null);
    };

    return(
        <authContext.Provider
        value={{
            user,
            login,
            logout,
            isAuthenticated: !!user
        }}
        >
            {children}
        </authContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(authContext);
};