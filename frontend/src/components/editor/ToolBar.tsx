import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';
import ContentCutIcon from '@mui/icons-material/ContentCut';

function ToolBar() {
    return (
        <aside className="bg-dark-1 flex sm:flex-col justify-between sm:py-6 items-center text-gray-300 text-sm sm:border-r">
            <div className='flex gap-8 sm:flex-col'>
                <button className='cursor-pointer w-full px-4 sm:px-10 py-2 sm:py-4 hover:bg-gray-500'>
                    <ContentCutIcon fontSize='large' />
                    <span className='hidden lg:block'>Trim</span>
                </button>

                <button className='cursor-pointer w-full px-4 sm:px-10 py-2 sm:py-4 hover:bg-gray-500'>
                    <UndoIcon fontSize='large' />
                    <span className='hidden lg:block'>Undo</span>
                </button>
            </div>

            <button className='cursor-pointer sm:w-full px-4 sm:px-10 py-2 sm:py-4 hover:bg-gray-500'>
                <SaveIcon fontSize='large' />
                <span className='hidden lg:block'>Save</span>
            </button>
        </aside>
    )
}

export default ToolBar;