import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import HomePage from "./features/public/pages/HomePage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Trang mặc định */}
                <Route
                    path="/"
                    element={<HomePage />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;