import { createBrowserRouter} from 'react-router-dom'

import ProtectedRoute from './ProtectedRoute'

//Layouts
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'

//Pages
import LandingPage from '../pages/LandingPage/LandingPage'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ResendConfirmationEmail from '../pages/Auth/ResendConfirmation'
import EmailConfirmation from '../pages/Auth/EmailConfirmation'
import ForgotPassword from '../pages/Auth/ForgotPassword'
import ResetPassword from '../pages/Auth/ResetPassword'
import Dashboard from '../pages/Dashboard/Dashboard'
import Library from '../pages/Dashboard/Library'
import FolderDetails from '../pages/Dashboard/FolderDetails'
import NotFound from '../pages/NotFound'
import QuizLayout from '../layouts/QuizLayout'
import CreateQuiz from '../pages/Quiz/CreateQuiz'
import ViewQuiz from '../pages/Quiz/ViewQuiz'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        index: true,
                        element: <Login />
                    },
                    {
                        path: 'register',
                        element: <Register />
                    },
                    {
                        path: 'verify-email',
                        element: <ResendConfirmationEmail />
                    },
                    {
                        path: 'confirm-email',
                        element: <EmailConfirmation />
                    },
                    {
                        path: 'forgot-password',
                        element: <ForgotPassword />
                    },
                    {
                        path: 'reset-password',
                        element: <ResetPassword />
                    }
                ]
            }
        ]
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />
                    },
                    {
                        path: 'library',
                        element: <Library />
                    },
                    {
                        path: 'library/folder/:folderId',
                        element: <FolderDetails />
                    },
                ]
            },
            {
                path: '/quiz',
                element: <QuizLayout />,
                children: [
                    {
                        path: 'create',
                        element: <CreateQuiz />
                    },
                    {
                        path: 'view/:quizId',
                        element: <ViewQuiz />
                    }
                ],
            },
        ]
    },

    {
        path: '*',
        element: <NotFound />
    }
])