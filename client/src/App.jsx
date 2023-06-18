import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import NotFound from "./pages/NotFound";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:username" element={<User />} />
                <Route path="/404" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default App;
