export default function UserHeader(props) {
    const { name } = props;
    return (
        <>
            <header className="">
                <h1 className="">{name}</h1>
            </header>
        </>
    );
}
