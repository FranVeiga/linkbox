import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Link from "../components/Link";

export default function User() {
    const { username } = useParams();
    const [currentUser, setCurrentUser] = useState({});
    const [links, setLinks] = useState([]);

    async function getUser(username) {
        const apiUrl = import.meta.env.VITE_API_URL + username;
        const response = await fetch(apiUrl);
        const userData = await response.json();
        setCurrentUser({ ...userData });
    }

    useEffect(() => {
        getUser(username);
    }, [username]);

    useEffect(() => {
        if (currentUser.links) setLinks(currentUser.links);
    }, [currentUser]);

    return (
        <>
            <UserHeader
                name={currentUser.name}
                username={currentUser.username}
                imageUrl={currentUser.profile_pic}
            />
            <div className="flex flex-col gap-4 container mx-auto items-center p-5">
                {links.map((link) => {
                    return (
                        <Link
                            key={link.order}
                            linkText={link.text}
                            linkUrl={link.url}
                            linkPic={link.link_pic}
                        />
                    );
                })}
            </div>
        </>
    );
}
