import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useContext } from 'react';
import { ToolContext } from '../../context/ToolContext';
import { Navigate } from 'react-router-dom';

function ToolBar() {
    const context = useContext(ToolContext)

    if (!context) {
        return <Navigate to={"/"} />
    }

    const { isTrimActive, setIsTrimActive, handleSave } = context;

    return (
        <aside className="bg-dark-1 flex sm:flex-col justify-between sm:py-6 items-center text-gray-300 text-sm sm:border-r">
            <div className='flex gap-8 sm:flex-col'>
                <button onClick={() => setIsTrimActive(!isTrimActive)} className={`cursor-pointer w-full px-4 sm:px-10 py-2 sm:py-4 ${isTrimActive ? "bg-blue-500 hover:bg-blue-400" : "hover:bg-gray-500"}`}>
                    <ContentCutIcon fontSize='large' />
                    <span className='hidden lg:block'>Trim</span>
                </button>

                <button className='cursor-pointer w-full px-4 sm:px-10 py-2 sm:py-4 hover:bg-gray-500'>
                    <UndoIcon fontSize='large' />
                    <span className='hidden lg:block'>Undo</span>
                </button>
            </div>

            <button onClick={handleSave} className='cursor-pointer sm:w-full px-4 sm:px-10 py-2 sm:py-4 hover:bg-gray-500'>
                <SaveIcon fontSize='large' />
                <span className='hidden lg:block'>Save</span>
            </button>
        </aside>
    )
}

export default ToolBar;