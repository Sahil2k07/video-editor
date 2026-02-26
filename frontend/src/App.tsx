import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import VideoProvider from "./context/VideoBlobContext";

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
          <RouterProvider router={router} />
        </VideoProvider>
      </QueryClientProvider>
    </main>
  )
}

export default App
