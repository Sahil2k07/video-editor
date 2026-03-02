import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import Button from "@mui/material/Button";
import { type ToolContextType, type VideoPayload } from '../../context/ToolContext';

type Props = {
    context: ToolContextType
    segments: VideoPayload[]
}

function ToolControls({ context, segments }: Props) {
    const { isMuted, setIsMuted, setSteps } = context;

    return (
        <div className="flex mx-auto md:max-w-6xl mb-3 justify-between items-center">
            <Button onClick={() => setIsMuted(!isMuted)} variant="text" color="inherit">
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </Button>

            <Button onClick={() => setSteps(prev => prev.concat(segments))} variant="contained" className="flex gap-2">
                <ContentCutIcon fontSize="small" />
                <span>Trim</span>
            </Button>
        </div>
    )
}

export default ToolControls;