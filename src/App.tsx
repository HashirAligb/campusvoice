import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home/Home";
import Login from "./pages/AuthPage/Login";
import Signup from "./pages/AuthPage/Signup";
import IssueDetail from "./pages/IssueDetail";
import MyIssues from "./pages/MyIssues";
import SearchResults from "./pages/SearchResults";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/issues/:issueId" element={<IssueDetail />} />
                <Route path="/MyIssues" element={<MyIssues />} />
                <Route path="/search" element={<SearchResults />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
