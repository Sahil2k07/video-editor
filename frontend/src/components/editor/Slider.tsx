import { useEffect, useState, useRef } from "react";

export type SelectionRange = {
    leftRatio: number;  // 0–1, how far left handle is from left edge
    rightRatio: number; // 0–1, how far right handle is from right edge
};

type Props = {
    children: React.ReactNode;
    onSelectionChange?: (selection: SelectionRange) => void;
};

function Slider({ children, onSelectionChange }: Props) {
    const containerRef = useRef<HTMLElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // leftPos: px from left edge (handle moves rightward)
    // rightPos: px from right edge (handle moves leftward)
    const [leftPos, setLeftPos] = useState(0);
    const [rightPos, setRightPos] = useState(0);

    const isDragging = useRef(false);
    const activeHandle = useRef<"left" | "right" | null>(null);
    const startMouseX = useRef(0);
    const startLeft = useRef(0);
    const startRight = useRef(0);

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

    // Notify parent whenever positions change
    useEffect(() => {
        if (!containerWidth || !onSelectionChange) return;
        onSelectionChange({
            leftRatio: leftPos / containerWidth,
            rightRatio: rightPos / containerWidth,
        });
    }, [leftPos, rightPos, containerWidth, onSelectionChange]);

    const handleMouseDown = (side: "left" | "right") => (e: React.MouseEvent) => {
        e.preventDefault();
        if (e.button !== 0) return;
        isDragging.current = true;
        activeHandle.current = side;
        startMouseX.current = e.clientX;
        startLeft.current = leftPosRef.current;
        startRight.current = rightPosRef.current;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current || !activeHandle.current) return;
            const delta = e.clientX - startMouseX.current;

            if (activeHandle.current === "left") {
                const maxLeft = containerWidth - startRight.current;
                const newLeft = Math.max(0, Math.min(startLeft.current + delta, maxLeft));
                setLeftPos(newLeft);
            } else {
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
        <section ref={containerRef} className="flex max-w-6xl mx-auto relative">
            {/* Left selected overlay — from left edge to left handle */}
            {leftPos > 0 && (
                <div
                    className="absolute top-0 left-0 h-full pointer-events-none z-10"
                    style={{
                        width: `${leftPos}px`,
                        backgroundColor: "rgba(239, 68, 68, 0.35)",
                    }}
                />
            )}

            {/* Right selected overlay — from right handle to right edge */}
            {rightPos > 0 && (
                <div
                    className="absolute top-0 right-0 h-full pointer-events-none z-10"
                    style={{
                        width: `${rightPos}px`,
                        backgroundColor: "rgba(239, 68, 68, 0.35)",
                    }}
                />
            )}

            {/* Left handle — moves rightward */}
            <div
                onMouseDown={handleMouseDown("left")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${leftPos}px)` }}
                className="bg-red-400 p-px relative flex items-center z-20"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>

            {children}

            {/* Right handle — moves leftward */}
            <div
                onMouseDown={handleMouseDown("right")}
                onMouseUp={(e) => e.preventDefault()}
                style={{ transform: `translateX(${-rightPos}px)` }}
                className="bg-red-400 p-px relative flex items-center z-20"
            >
                <span className="cursor-pointer rounded-full w-1.5 h-2.5 bg-red-400 p-1.5 absolute -left-1.5"></span>
            </div>
        </section>
    );
}

export default Slider;