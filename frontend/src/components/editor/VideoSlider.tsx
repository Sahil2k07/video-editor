import { useEffect, useState } from "react";

type Props = {
    video: React.RefObject<HTMLVideoElement | null>;
};

type TimeStep = {
    time: number;
    image: string;
};

function VideoSlider({ video }: Props) {
    const [timeSteps, setTimeSteps] = useState<TimeStep[]>([]);

    useEffect(() => {
        const vid = video.current;
        if (!vid) return;

        const handleLoadedMetadata = async () => {
            const frameInterval = 0.5; // slider steps
            const captureInterval = 3; // capture every 3s
            const duration = vid.duration;

            const times = Array.from(
                { length: Math.floor(duration / frameInterval) + 1 },
                (_, i) => Math.round(i * frameInterval * 10) / 10
            );

            const frames: TimeStep[] = [];
            let lastImage = "";

            for (const t of times) {
                if (t === 0 || t % captureInterval === 0) {
                    await new Promise<void>((resolve) => {
                        const handleSeeked = () => {
                            const canvas = document.createElement("canvas");
                            canvas.width = vid.videoWidth;
                            canvas.height = vid.videoHeight;
                            const ctx = canvas.getContext("2d");
                            if (ctx) ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

                            lastImage = canvas.toDataURL();

                            vid.removeEventListener("seeked", handleSeeked);
                            resolve();
                        };

                        vid.addEventListener("seeked", handleSeeked);
                        vid.currentTime = t;
                    });
                }

                frames.push({ time: t, image: lastImage });
            }

            // batch update state once
            setTimeSteps(frames);
        };

        vid.addEventListener("loadedmetadata", handleLoadedMetadata);
        return () => vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }, [video]);

    return (
        <section
            className="overflow-x-scroll scrollable max-w-2xl cursor-pointer mx-auto"
            onWheel={(e) => {
                e.preventDefault();
                e.currentTarget.scrollLeft += e.deltaY;
            }}
        >
            <div className="flex w-max">
                {timeSteps.map((step) => (
                    <div key={step.time} className="flex flex-col items-center w-24 shrink-0">
                        <p className="text-sm bg-black w-full text-center">{step.time}s</p>
                        <img
                            src={step.image}
                            alt={`Frame at ${step.time}s`}
                            className="w-full h-auto border border-gray-800"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default VideoSlider;