import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VideoContext } from "../../context/VideoBlobContext";
import VideoSlider from "./VideoSlider";

function VideoView() {
    const [videoURL, setVideoURL] = useState("")
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const hiddenVideoRef = useRef<HTMLVideoElement | null>(null)

    const navigate = useNavigate();

    const context = useContext(VideoContext)

    useEffect(() => {
        if (!context) {
            navigate("/")
            return;
        }

        const { currentVideo } = context;

        if (!currentVideo) {
            navigate("/")
            return;
        }

        const videoURL = URL.createObjectURL(currentVideo.blob)
        setVideoURL(videoURL)

        return () => {
            URL.revokeObjectURL(videoURL)
        }
    }, [context, navigate])

    return (
        <main className="bg-dark-2 flex flex-col justify-center items-center">
            <video ref={videoRef} className="w-4xl p-6" controls src={videoURL}></video>

            {/* Hidden video for frame capture */}
            <video
                ref={hiddenVideoRef}
                src={videoURL}
                preload="auto"
                muted
                className="hidden"
            ></video>

            <div className="bg-dark-3 w-full p-6">
                <VideoSlider video={hiddenVideoRef} />
            </div>
        </main>
    )
}

export default VideoView;