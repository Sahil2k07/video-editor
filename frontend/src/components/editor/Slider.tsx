import { useEffect, useState, useRef } from "react";

type Props = {
    children: React.ReactNode;
};

function Slider({ children }: Props) {
    const containerRef = useRef<HTMLElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // leftPos: how far the left handle has moved right from the left edge (px)
    // rightPos: how far the right handle has moved left from the right edge (px)
    const [leftPos, setLeftPos] = useState(0);
    const [rightPos, setRightPos] = useState(0);

    // Use refs for drag state so mousemove never has stale values
    const isDragging = useRef(false);
    const activeHandle = useRef<"left" | "right" | null>(null);
    const startMouseX = useRef(0);
    const startLeft = useRef(0);
    const startRight = useRef(0);

    // Track latest positions in refs so the mousemove closure always sees current values
    const leftPosRef = useRef(leftPos);
    const rightPosRef = useRef(rightPos);
    leftPosRef.current = leftPos;
    rightPosRef.current = rightPos;

    // Measure container width
    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setContainerWidth(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleMouseDown = (side: "left" | "right") => (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button !== 0) return;
        isDragging.current = true;
        activeHandle.current = side;
        startMouseX.current = e.clientX;
        // Snapshot positions at drag start
        startLeft.current = leftPosRef.current;
        startRight.current = rightPosRef.current;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !activeHandle.current) return;
            const delta = e.clientX - startMouseX.current;

            if (activeHandle.current === "left") {
                // Left handle moves right; must not cross past the right handle's inward position
                const maxLeft = containerWidth - startRight.current;
                const newLeft = Math.max(0, Math.min(startLeft.current + delta, maxLeft));
                setLeftPos(newLeft);
            } else {
                // Right handle moves left; must not cross past the left handle's position
                const maxRight = containerWidth - startLeft.current;
                const newRight = Math.max(0, Math.min(startRight.current - delta, maxRight));
                setRightPos(newRight);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            if (e.button === 0) {
                isDragging.current = false;
                activeHandle.current = null;
            }
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [containerWidth]);

    return (
        <section ref={containerRef} className="flex max-w-2xl mx-auto relative">
            {/* Left Slider */}
            <div
                onMouseDown={handleMouseDown("left")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${leftPos}px)` }}
                className="bg-red-400 p-px relative flex items-center"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>

            {children}

            {/* Right Slider */}
            <div
                onMouseDown={handleMouseDown("right")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${-rightPos}px)` }}
                className="bg-red-400 p-px relative flex items-center"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>
        </section>
    );
}

export default Slider;