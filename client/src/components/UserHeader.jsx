export default function UserHeader(props) {
    const { name } = props;
    return (
        <>
            <header>
                <h1 className="title">{name}</h1>
            </header>
        </>
    );
}
