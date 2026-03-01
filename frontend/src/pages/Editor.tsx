import PropertiesView from "../components/editor/PropertiesView";
import ToolBar from "../components/editor/ToolBar";
import VideoView from "../components/editor/VideoView";

function Editor() {
    return (
        <section className="flex flex-col sm:flex-row min-h-screen">
            <ToolBar />
            <VideoView />
            <PropertiesView />
        </section>
    )
}

export default Editor;