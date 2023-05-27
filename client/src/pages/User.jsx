import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function User() {
    const { username } = useParams();
    const [currentUser, setCurrentUser] = useState();

    async function getUser(username) {
        const apiUrl = import.meta.env.VITE_API_URL + username;
        const response = await fetch(apiUrl);
        const userData = await response.json();
        setCurrentUser({ ...userData });
    }

    useEffect(() => {
        getUser(username);
    }, [username]);

    return (
        <>
            <p>{JSON.stringify(currentUser)}</p>
        </>
    );
}
