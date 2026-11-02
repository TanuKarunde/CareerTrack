import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import Home from "../pages/Home/Home";
import Register from "../pages/Auth/Register/Register";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import RoleRoutes from "./RoleRoutes";
import JobDetails from "../pages/Student/JobDetails/JobDeatils";
import Applications from "../pages/Student/Applications/Applications";
import Dashboard from "../pages/Student/Dashboard/Dashboard";
import ApplicationDetails from "../pages/Student/ApplicationDetails/ApplicationDetails";
import Applicants from "../pages/Employer/Applicants/Applicants";
import EDashboard from "../pages/Employer/Dashboard/EDashboard";
import CreateJob from "../pages/Employer/CreateJob/CreateJob";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import Jobs from "../pages/Student/Jobs/Jobs";
import EJobs from "../pages/Employer/Jobs/EJobs";
import EditJob from "../pages/Employer/EditJob/EditJob";
import EJobDetails from "../pages/Employer/JobDetails/EJobDetails";
import Interviews from "../pages/Employer/Interviews/Interviews";
import EmployerProfile from "../pages/Employer/EmployerProfile/EmployerProfile";
import CompanyProfile from "../pages/Employer/CompanyProfile/CompanyProfile";
import InterviewPrep from "../pages/Student/InterviewPrep/InterviewPrep";
import InterviewPrepResult from "../pages/Student/InterviewPrep/InterviewPrepResult";
import InterviewPrepScoreboard from "../pages/Student/InterviewPrep/InterviewPrepScoreboard";
import StudentProfile from "../pages/Student/Profile/StudentProfile";
import EditStudentProfile from "../pages/Student/Profile/EditStudentProfile";
import CreateCompany from "../pages/Employer/CompanyProfile/CreateCompany";
import SearchJobs from "../pages/Home/SearchJobs";
import CompanyDetails from "../pages/Student/JobDetails/CompanyDetails";
import ApplicantProfilePage from "../pages/Employer/ApplicantProfilePage/ApplicantProfilePage";
import ResumeViewer from "../pages/Employer/ApplicantProfilePage/ResumeViewer";
import { ToastContainer } from "react-toastify";
import ScheduleInterview from "../pages/Employer/Interviews/ScheduleInterview";
import JobReadinessPage from "../pages/Student/JobDetails/JobReadinessPage";
import MissionControl from "../pages/Student/Mission-Control/MissionControl";
import ResumeAnalyzer from "../pages/Student/Resume-Analyzer/ResumeAnalyzer";
import SmartCandidateMatchPage from "../pages/Employer/Match-Candidates/SmartCandidateMatchPage";
import NotificationPage from "../pages/Notifications/NotificationPage";
import ChatPage from "../pages/Student/Chat/ChatPage";
import SInterviews from "../pages/Student/Interviews/SInterviews";
import FullScreenInterview from "../pages/Student/InterviewPrep/FullScreenInterview";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminRoute from "./AdminRoute";
import AdminUsers from "../pages/Admin/AdminUsers";
import CompanyVerification from "../pages/Admin/CompanyVerification";
import JobModeration from "../pages/Admin/JobModeration";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import AdminAnnouncements from "../pages/Admin/AdminAnnouncements";
import PremiumPlans from "../pages/Student/Premium/PremiumPlans";


function AppRoutes() {

    return (
        <BrowserRouter>

        <ToastContainer
                position="top-center"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />
            {/* Public */}
            <Routes>

                {/* ONLY HOME HAS NAVBAR */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* PUBLIC PAGES WITHOUT NAVBAR */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/search-jobs" element={<SearchJobs />} />
                <Route
  path="/notifications"
  element={<NotificationPage />}
/>


                {/* Admin */}

                <Route
    path="/admin/dashboard"
    element={
        <AdminRoute>
            <AdminDashboard />
        </AdminRoute>
    }
/>

<Route
    path="/admin/users"
    element={
        <AdminRoute>
            <AdminUsers />
        </AdminRoute>
    }
/>

<Route
    path="/admin/companies"
    element={
        <AdminRoute>
            <CompanyVerification />
        </AdminRoute>
    }
/>

<Route path="/admin/jobs" element={<JobModeration />} />

<Route
    path="/admin/analytics"
    element={<AdminAnalytics />}
/>

<Route
    path="/admin/announcements"
    element={<AdminAnnouncements />}
/>

                {/* Student */}
                <Route element={<RoleRoutes allowedRole="STUDENT" />
                }>

                    <Route path="/student/jobs"
                        element={<Jobs />} />

                    <Route path="/student/jobs/:id"
                        element={<JobDetails />}
                    />

                    <Route path="/student/applications"
                        element={<Applications />}
                    />

                    <Route path="/student/dashboard"
                        element={<Dashboard />} />

                    <Route path="/student/applications/:id"
                        element={<ApplicationDetails />}
                    />
                </Route>

                <Route
    path="/student/company/:employerId"
    element={<CompanyDetails />}
/>

<Route
    path="/student/interviews"
    element={<SInterviews />}
/>

                <Route
                    path="/student/interview-prep"
                    element={<InterviewPrep />}
                />

                <Route
  path="/student/interview-prep/session/:sessionId"
  element={<FullScreenInterview />}
/>

                {/* <Route
                    path="/student/interview-prep/session/:sessionId"
                    element={<InterviewPrepSession />}
                /> */}

                <Route
                    path="/student/interview-prep/:sessionId/result"
                    element={<InterviewPrepResult />}
                />

                <Route
                    path="/student/interview-prep/scoreboard"
                    element={<InterviewPrepScoreboard />}
                />

                <Route
                    path="/student/profile"
                    element={<StudentProfile />}
                />

                <Route
                    path="/student/profile/edit"
                    element={<EditStudentProfile />}
                />

                <Route
    path="/student/jobs/:jobId/readiness"
    element={<JobReadinessPage />}
/>

<Route
  path="/student/mission-control"
  element={<MissionControl jobId={1} />}
/>

<Route
  path="/student/resume-analyzer"
  element={<ResumeAnalyzer />}
/>

<Route path="/student/chat" element={<ChatPage />} />

<Route
    path="/student/premium"
    element={<PremiumPlans />}
/>

                {/* Employer */}

                <Route element={<RoleRoutes allowedRole="EMPLOYER" />}>

                    <Route path="/employer/dashboard"
                        element={<EDashboard />} />

                    <Route path="/employer/applicants"
                        element={<Applicants />} />

                    <Route path="/employer/jobs/create"
                        element={<CreateJob />} />

                    <Route path="/employer/jobs"
                        element={<EJobs />} />

                    <Route path="/employer/jobs/edit/:id"
                        element={<EditJob />} />

                    <Route
                        path="/employer/jobs/:id"
                        element={<EJobDetails />}
                    />

                    <Route
                        path="/employer/interviews"
                        element={<Interviews />}
                    />

                    <Route
                        path="/employer/profile"
                        element={<EmployerProfile />}
                    />

                    <Route
                        path="employer/companyprofile"
                        element={<CompanyProfile />}
                    />

                    <Route
                        path="/employer/company/create"
                        element={<CreateCompany />}
                    />

                    <Route
                        path="/employer/applicants/:applicationId"
                        element={<ApplicantProfilePage />}
                    />

                    <Route
    path="/employer/applicants/:applicationId/resume"
    element={<ResumeViewer />}
/>

<Route
    path="/employer/interviews/schedule/:applicationId"
    element={<ScheduleInterview />}
/>

<Route
  path="/employer/jobs/:jobId/smart-matches"
  element={<SmartCandidateMatchPage />}
/>

                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes