import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                {/* later we’ll add: <Route path="/app/*" element={<ClientApp />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;