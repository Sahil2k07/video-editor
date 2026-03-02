import { useEffect, useState, useRef, useCallback, useContext } from "react";
import Slider, { type SelectionRange } from "./Slider";
import ToolControls from "./ToolControl";
import { ToolContext, type VideoPayload } from "../../context/ToolContext";
import { Navigate } from "react-router-dom";

type Props = {
    video: React.RefObject<HTMLVideoElement | null>;
    onSelectionChange?: (selected: SelectedSegments) => void;
};

type TimeStep = {
    time: number;
    image: string;
};

// Payload sent to parent / backend
// Each entry = a selected segment (start–end in seconds)
// Selected = the parts from start→leftHandle and rightHandle→end
export type SelectedSegments = {
    segments: { from: number; to: number }[];
    duration: number;
};

function VideoFrames({ video, onSelectionChange }: Props) {
    const context = useContext(ToolContext)

    if (!context) {
        return <Navigate to="/" />
    }

    const { setSteps, isMuted, isTrimActive } = context;

    const [timeSteps, setTimeSteps] = useState<TimeStep[]>([]);
    const [duration, setDuration] = useState(0);
    const [_, setSelection] = useState<SelectionRange>({ leftRatio: 0, rightRatio: 0 });
    const [payload, setPayload] = useState<VideoPayload[]>([])

    const totalScrollWidth = useRef(0);
    const scrollRef = useRef<HTMLElement>(null);

    // Capture frames on video load
    useEffect(() => {
        const vid = video.current;
        if (!vid) return;

        const handleLoadedMetadata = async () => {
            const frameInterval = 0.5;
            const captureInterval = 3;
            const dur = vid.duration;
            setDuration(dur);

            const times = Array.from(
                { length: Math.floor(dur / frameInterval) + 1 },
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

            setTimeSteps(frames);
        };

        vid.addEventListener("loadedmetadata", handleLoadedMetadata);
        return () => vid.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }, [video]);

    // Track scroll container's total scroll width (for ratio → time mapping)
    useEffect(() => {
        if (!scrollRef.current) return;
        const observer = new ResizeObserver(() => {
            totalScrollWidth.current = scrollRef.current?.scrollWidth ?? 0;
        });
        observer.observe(scrollRef.current);
        return () => observer.disconnect();
    }, [timeSteps]);

    // Convert slider ratios → time segments and bubble up
    const handleSelectionChange = useCallback(
        (sel: SelectionRange) => {
            setSelection(sel);

            const segments: VideoPayload[] = []

            if (!onSelectionChange || !duration) return;

            const leftTime = parseFloat((sel.leftRatio * duration).toFixed(2));
            const rightTime = parseFloat(((1 - sel.rightRatio) * duration).toFixed(2));

            // Left selected region: start → leftHandle
            if (leftTime > 0) {
                segments.push({ from: 0, to: leftTime, isMuted, isTrimmed: isTrimActive });
            }

            // Right selected region: rightHandle → end
            if (rightTime < duration) {
                segments.push({ from: rightTime, to: duration, isMuted, isTrimmed: isTrimActive });
            }

            onSelectionChange({ segments, duration });
        },
        [duration, onSelectionChange]
    );

    return (
        <>
            <ToolControls context={context} segments={payload} />

            <Slider onSelectionChange={handleSelectionChange}>
                <section
                    ref={scrollRef}
                    className="overflow-x-scroll scrollable"
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.scrollLeft += e.deltaY
                    }}
                >
                    <div className="flex w-max">
                        {timeSteps.map((step) => (
                            <div
                                key={step.time}
                                className="flex flex-col items-center w-24 shrink-0 cursor-pointer"
                            >
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
            </Slider>
        </>
    );
}

export default VideoFrames;