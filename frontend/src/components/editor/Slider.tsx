import { useEffect, useState, useRef } from "react";

type Props = {
    side: "left" | "right";
};

function Slider({ side }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [positionX, setPositionX] = useState(0);
    const [startMouseX, setStartMouseX] = useState(0);
    const initialPosition = useRef(0); // track the starting point

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0) {
            setIsDragging(true);
            setStartMouseX(e.clientX - positionX);
            if (initialPosition.current === 0) {
                initialPosition.current = positionX; // store the starting point
            }
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
            setIsDragging(false);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            let newPos = e.clientX - startMouseX;

            // Restrict movement if side === "left"
            if (side === "left") {
                newPos = Math.max(initialPosition.current, newPos); // cannot go left
            }

            // Restrict movement if side === "right"
            if (side === "right") {
                newPos = Math.min(initialPosition.current, newPos); // cannot go right
            }

            setPositionX(newPos);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, startMouseX, side]);

    return (
        <div
            onMouseDown={handleMouseDown}
            onMouseUp={(e) => e.preventDefault()}
            style={{ transform: `translateX(${positionX}px)` }}
            className="bg-red-400 p-px relative flex items-center"
        >
            <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
        </div>
    );
}

export default Slider;