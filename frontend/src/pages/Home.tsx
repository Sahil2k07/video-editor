import FileUpload from "../components/home/FileUpload";

function Home() {
    return (
        <section className="flex justify-center items-center h-screen">
            <header className="flex flex-col justify-center items-center gap-6 border bg-dark-2 border-gray-500 p-6 rounded-2xl">
                <h1>Please select a Video File to Proceed</h1>
                <FileUpload />
            </header>
        </section>
    )
}

export default Home;