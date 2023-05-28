export default function Link(props) {
    const { linkText, linkUrl, linkPic } = props;

    return (
        <>
            <div className="max-w-2xl bg-gray-200 h-auto w-full flex p-4 items-center gap-4 rounded-lg">
                <img className="w-16 h-16 rounded object-fit " src={linkPic} />
                <a href={linkUrl} target="_blank" className="text-xl">
                    {linkText}
                </a>
            </div>
        </>
    );
}
