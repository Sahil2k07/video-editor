import { createContext, useState } from "react";

export type VideoPayload = {
    from: number;
    to: number;
    isMuted: boolean;
    isTrimmed: boolean;
}

export type ToolContextType = {
    isTrimActive: boolean;
    isMuted: boolean;
    setIsTrimActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => void;
    handleUndo: () => void;
    steps: VideoPayload[][];
    setSteps: React.Dispatch<React.SetStateAction<VideoPayload[][]>>;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined)

function ToolContextProvider({ children }: { children: React.ReactNode }) {
    const [isTrimActive, setIsTrimActive] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    const [steps, setSteps] = useState<VideoPayload[][]>([]);

    const handleUndo = () => {
        steps.pop()
    }

    const handleSave = () => {
        const payload = steps.flat()

        alert(JSON.stringify(payload))

        console.log({ payload });
    }

    return (
        <ToolContext.Provider value={{ isTrimActive, setIsTrimActive, handleSave, isMuted, setIsMuted, handleUndo, steps, setSteps }}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolContextProvider