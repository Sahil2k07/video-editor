import { useEffect, useState, useRef } from "react";

type Props = {
    children: React.ReactNode;
};

function Slider({ children }: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [activeHandle, setActiveHandle] = useState<"left" | "right" | null>(null);
    const [positionX, setPositionX] = useState({ left: 0, right: 0 });
    const startMouseX = useRef(0);
    const initialPosition = useRef({ left: 0, right: 0 });

    const handleMouseDown = (side: "left" | "right") => (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button === 0) {
            setIsDragging(true);
            setActiveHandle(side);
            startMouseX.current = e.clientX;
            initialPosition.current[side] = positionX[side];
        }
    };

    const handleMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
            setIsDragging(false);
            setActiveHandle(null);
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !activeHandle) return;

            const delta = e.clientX - startMouseX.current;
            const newPos = initialPosition.current[activeHandle] + delta;

            setPositionX((prev) => ({
                ...prev,
                [activeHandle]: newPos,
            }));
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, activeHandle]);

    return (
        <section className="flex max-w-2xl mx-auto relative">
            {/* Left handle */}
            <div
                onMouseDown={handleMouseDown("left")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${positionX.left}px)` }}
                className="bg-red-400 p-px relative flex items-center"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>

            {children}

            {/* Right handle */}
            <div
                onMouseDown={handleMouseDown("right")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${positionX.right}px)` }}
                className="bg-red-400 p-px relative flex items-center"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>
        </section>
    );
}

export default Slider;