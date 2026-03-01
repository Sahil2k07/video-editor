import { createContext, useState } from "react";

type ToolContextType = {
    isTrimActive: boolean;
    isMuted: boolean;
    setIsTrimActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
    handleSave: () => void;
}

export const ToolContext = createContext<ToolContextType | undefined>(undefined)

function ToolContextProvider({ children }: { children: React.ReactNode }) {
    const [isTrimActive, setIsTrimActive] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    const handleSave = () => { }

    return (
        <ToolContext.Provider value={{ isTrimActive, setIsTrimActive, handleSave, isMuted, setIsMuted }}>
            {children}
        </ToolContext.Provider>
    )
}

export default ToolContextProvider