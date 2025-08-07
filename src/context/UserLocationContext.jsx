import { createContext, useContext } from "react";
import useUserLocation from "../hooks/useUserLocation.js";

const UserLocationContext = createContext();

export function UserLocationProvider({ children }) {
    const { location, error } = useUserLocation();

    return (
        <UserLocationContext.Provider value={{ location, error }}>
            {children}
        </UserLocationContext.Provider>
    );
}

export function useUserLocationContext() {
    return useContext(UserLocationContext);
}
