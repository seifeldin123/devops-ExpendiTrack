import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './components/PrivateRoute';
import Welcome from "./pages/Welcome";
import {BudgetProvider} from "./contexts/BudgetContext";
import {ExpenseProvider} from "./contexts/ExpenseContext";



function App() {
    return (
        <UserProvider>
            <BudgetProvider>
                <ExpenseProvider>
                    <Router>
                        <MainLayout>
                            <Routes>
                                <Route path="/" element={<Welcome />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<SignUp />} />
                                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </MainLayout>
                    </Router>
                </ExpenseProvider>
            </BudgetProvider>
        </UserProvider>
    );
}
export default App;
