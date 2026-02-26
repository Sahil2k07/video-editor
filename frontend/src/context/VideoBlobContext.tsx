import { createContext, useState } from "react";

export interface VideoDetails {
    name: string;
    url: string;
    size: number;
    type: string;
    blob: Blob;
    metadata?: any;
}

type VideoContextType = {
    currentVideo: VideoDetails | null;
    setCurrentVideo: (video: VideoDetails | null) => void;
}

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

const VideoProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentVideo, setCurrentVideo] = useState<VideoDetails | null>(null);

    return (
        <VideoContext.Provider value={{ currentVideo, setCurrentVideo }}>
            {children}
        </VideoContext.Provider>
    );
};

export default VideoProvider;