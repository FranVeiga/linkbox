export default function UserHeader(props) {
    const { name, imageUrl, username } = props;
    return (
        <>
            <header className="p-0 sm:p-8 w-screen mx-auto mb-10 flex justify-center items-center bg-blue-300">
                <img
                    className="w-16 h-16 sm:w-12 sm:h-12 rounded-full"
                    src={imageUrl}
                />
                <div className="p-6">
                    <h1 className="text-3xl sm:text-xl text-center">{name}</h1>
                    <p className="text-gray-500">@{username}</p>
                </div>
            </header>
        </>
    );
}
