/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { authService } from "../services/authService";
import { accessTokenService } from "../services/accessTokenService";

export const AuthContext = React.createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isChecked, setChecked] = useState(false);

    async function activate(activationToken) {
        const { accessToken, user } = await authService.activate(activationToken);

        accessTokenService.save(accessToken);
        setUser(user);
    }
    
    async function checkAuth() {
        try {
            const { accessToken, user } = await authService.refresh();

            accessTokenService.save(accessToken);
            setUser(user);
        } catch (error) {
            console.log('User is not authenticated');
        } finally {
            setChecked(true);
        }
    }

    async function login({ email, password }) {
        const { accessToken, user } = await authService.login({ email, password });

        accessTokenService.save(accessToken);
        setUser(user);
    }

    async function logout() {
        await authService.logout();

        accessTokenService.remove();
        setUser(null);
    }

    async function reset() {
        await authService.reset();
    }

    async function change(user) {
        await authService.updateInformation(user);
        setUser(user);
    }

    async function changeEmailAuth(user) {
        await authService.confirmChangeEmail(user);
        setUser(user);
    }

    const value = useMemo(
        () => ({
            isChecked,
            user,
            checkAuth,
            activate,
            login,
            logout,
            reset,
            change,
            changeEmailAuth,
        }),
        [user, isChecked]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}