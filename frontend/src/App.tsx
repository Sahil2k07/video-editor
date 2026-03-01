import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import VideoProvider from "./context/VideoBlobContext";
import ToolContextProvider from "./context/ToolContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/editor/:video", element: <Editor /> }
])

function App() {
  return (
    <main>
      <QueryClientProvider client={queryClient}>
        <VideoProvider>
          <ToolContextProvider>
            <RouterProvider router={router} />
          </ToolContextProvider>
        </VideoProvider>
      </QueryClientProvider>
    </main>
  )
}

export default App
