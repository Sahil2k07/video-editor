import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import Notification, { type NotificationState } from '../common/Notification';
import { VideoContext } from '../../context/VideoBlobContext';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function FileUpload() {
    const navigate = useNavigate();

    const context = useContext(VideoContext)

    useEffect(() => {
        if (!context) {
            navigate("/")
            return;
        }
    }, [])

    const [notification, setNotification] = useState<NotificationState | null>(null)

    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = event.target.files?.[0];
            if (!file) return;

            const currentVideo = {
                url: file.name.replace(" ", ""),
                name: file.name,
                size: file.size,
                type: file.type,
                blob: file,
            }

            context?.setCurrentVideo(currentVideo);
            navigate(`/editor/${currentVideo.url}`);
        } catch (error) {
            console.error(error);
            setNotification({ type: "error", message: (error as Error)?.message || "Something went wrong" })
        } finally {
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <>
            <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload file
                <VisuallyHiddenInput
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleUpload}
                    multiple={false}
                />
            </Button>

            <Notification data={notification} />
        </>
    );
}