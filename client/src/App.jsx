import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:username" element={<User />} />
            </Routes>
        </>
    );
}

export default App;
