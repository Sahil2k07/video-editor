import PropertiesView from "../components/editor/PropertiesView";
import VideoView from "../components/editor/VideoView";

function Editor() {
    return (
        <section className="flex flex-row md:flex-col">
            <PropertiesView />
            <VideoView />
            <PropertiesView />
        </section>
    )
}

export default Editor;