import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoContext } from "../../context/VideoBlobContext";

function VideoView() {
    const [videoURL, setVideoURL] = useState("")

    const navigate = useNavigate();

    const context = useContext(VideoContext)
    if (!context) {
        navigate("/")
        return;
    }

    const { currentVideo } = context;

    useEffect(() => {
        if (!currentVideo) {
            navigate("/")
            return;
        }

        setVideoURL(URL.createObjectURL(currentVideo.blob))
    }, [])

    return (
        <main>
            <video className="w-4xl p-16" controls src={videoURL}></video>
        </main>
    )
}

export default VideoView;