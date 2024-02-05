import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import LoginComponent from './components/LoginComponent';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Welcome from "./components/Welcome";
import {BudgetProvider} from "./contexts/BudgetContext";


function App() {
    return (
        <UserProvider>
            <BudgetProvider>
                <Router>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<Welcome />} />
                            <Route path="/login" element={<LoginComponent />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                            <Route path="*" element={<PageNotFound />} />
                        </Routes>
                    </MainLayout>
                </Router>
            </BudgetProvider>
        </UserProvider>
    );
}
export default App;
