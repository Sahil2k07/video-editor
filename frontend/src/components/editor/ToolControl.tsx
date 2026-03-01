import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Button from "@mui/material/Button";
import { useContext } from 'react';
import { ToolContext } from '../../context/ToolContext';
import { Navigate } from 'react-router-dom';

function ToolControls() {
    const context = useContext(ToolContext)

    if (!context) {
        return <Navigate to="/" />
    }

    const { isTrimActive, isMuted, setIsMuted } = context

    return (
        <>
            {isTrimActive && (
                <div className="flex mx-auto md:max-w-4xl mb-3 justify-between items-center">
                    <Button onClick={() => setIsMuted(!isMuted)} variant="text" color="inherit">
                        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                    </Button>

                    <Button variant="contained" className="flex gap-2">
                        <ContentCutIcon fontSize="small" />
                        <span>Trim</span>
                    </Button>
                </div>
            )}
        </>
    )
}

export default ToolControls;