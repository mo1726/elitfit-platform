import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public

import MembershipPlansPage from "./components/Public/MembershipPlans1";
import PlanDetails from "./components/Public/PlanDetails";

// Auth
import Login from "./components/Auth/LoginPage";
import Register from "./components/Auth/RegisterPage";
import Logout from "./components/Auth/Logout";

// Dashboards
import MemberDashboard from "./components/Dashboards/MemberDashboard";
import MemberDashboardNotPurchased from "./components/Dashboards/MemberDashboardNotPurchased";
import TrainerDashboard from "./components/Dashboards/TrainerDashboard";
import AdminDashboard from "./components/Dashboards/AdminDashboard";

// Member Pages
import PlanPage from "./components/Member/PlanPage";
import TrainerPage from "./components/Member/TrainerPage";
import BookClassPage from "./components/Member/BookClassPage";
import BookingsPage from "./components/Member/BookingsPage";
import FeedbackModal from "./components/Member/FeedbackModal.js";
import DietPlanPage from "./components/Member/DietPlanPage.js";


// Member Legacy
import UpgradeMembership from "./components/Member/UpgradeMembership.js";
import Profile from "./components/Public/Profile.js";

// Trainer
import MyClasses from "./components/Trainer/MyClasses";
import MyMembers from "./components/Trainer/MyMembers";
import Performance from './components/Trainer/Performance';
import MySchedule from './components/Trainer/MySchedule';
import CreateDietPlanPage from "./components/Trainer/CreateDietPlanPage.js";
import EditDietPlanPage from "./components/Trainer/EditDietPlanPage.js";
import DietPlanListPage from "./components/Trainer/DietPlanListPage.js";

// Admin
import AllBookings from "./components/Admin/AllBookings";
import AllUsers from "./components/Admin/AllUsers";
import AdminPlansManager from "./components/Admin/AdminPlansManager";
import UserManagement from "./components/Admin/UserManagement";
import TrainerManagement from "./components/Admin/TrainerManagement";
import MemberSubscriptions from "./components/Admin/MemberSubscriptions";
import ClassManagement from "./components/Admin/ClassManagement";

// Access Control
import PrivateRoute from "./components/Shared/PrivateRoute";
import GuestOnlyRoute from "./routes/GuestOnlyRoute";
import CalendarPage from "./components/Member/CalendarPage.js";
import IndexPage from "./components/Public/indexPage.js";

const App = () => (
  <>
    <ToastContainer position="top-right" theme="dark" autoClose={3000} />
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<IndexPage />} />
        <Route path="/membership-plans" element={<MembershipPlansPage />} />
        <Route path="/plan/:id" element={<PlanDetails />} />
        <Route path="/logout" element={<Logout />} />

        {/* Guest Only Routes */}
        <Route path="/login" element={<GuestOnlyRoute><Login /></GuestOnlyRoute>} />
        <Route path="/register" element={<GuestOnlyRoute><Register /></GuestOnlyRoute>} />

        {/* Member Dashboard + Features */}
        <Route path="/member-dashboard" element={<PrivateRoute role="ROLE_MEMBER"><MemberDashboard /></PrivateRoute>} />
        <Route path="/member-not-purchased" element={<PrivateRoute role="ROLE_MEMBER"><MemberDashboardNotPurchased /></PrivateRoute>} />
        <Route path="/member/plan" element={<PrivateRoute role="ROLE_MEMBER"><PlanPage /></PrivateRoute>} />
        <Route path="/member/trainer" element={<PrivateRoute role="ROLE_MEMBER"><TrainerPage /></PrivateRoute>} />
        <Route path="/member/book-class" element={<PrivateRoute role="ROLE_MEMBER"><BookClassPage /></PrivateRoute>} />
        <Route path="/member/bookings" element={<PrivateRoute role="ROLE_MEMBER"><BookingsPage /></PrivateRoute>} />
        <Route path="/member/feedback" element={<PrivateRoute role="ROLE_MEMBER"><FeedbackModal /></PrivateRoute>} />
        <Route path="/member/diet-plans/:memberId" element={<PrivateRoute role="ROLE_MEMBER"><DietPlanPage /></PrivateRoute>} />
        <Route path="/member/bookings-upcoming-hour" element={<PrivateRoute role="ROLE_MEMBER"><CalendarPage /></PrivateRoute>} />
  
        <Route path="/upgrade-membership" element={<PrivateRoute role="ROLE_MEMBER"><UpgradeMembership /></PrivateRoute>} />
        <Route path="/upgrade-membership/:id" element={<PrivateRoute role="ROLE_ADMIN"><UpgradeMembership /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Trainer Routes */}
        <Route path="/trainer-dashboard" element={<PrivateRoute role="ROLE_TRAINER"><TrainerDashboard /></PrivateRoute>} />
        <Route path="/my-classes" element={<PrivateRoute role="ROLE_TRAINER"><MyClasses /></PrivateRoute>} />
        <Route path="/my-members" element={<PrivateRoute role="ROLE_TRAINER"><MyMembers /></PrivateRoute>} />
        <Route path="/performance" element={<PrivateRoute role="ROLE_TRAINER"><Performance /></PrivateRoute>} />
        <Route path="/my-schedule" element={<PrivateRoute role="ROLE_TRAINER"><MySchedule /></PrivateRoute>} />
        <Route path="/create-diet/:memberId" element={<CreateDietPlanPage />} />
        <Route path="/edit-diet/:planId" element={<PrivateRoute role="ROLE_TRAINER"><EditDietPlanPage /></PrivateRoute>} />
        <Route path="/my-diet-plans" element={<PrivateRoute role="ROLE_TRAINER"><DietPlanListPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<PrivateRoute role="ROLE_ADMIN"><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/users" element={<PrivateRoute role="ROLE_ADMIN"><UserManagement /></PrivateRoute>} />
        <Route path="/admin/trainers" element={<PrivateRoute role="ROLE_ADMIN"><TrainerManagement /></PrivateRoute>} />
        <Route path="/admin/members" element={<PrivateRoute role="ROLE_ADMIN"><MemberSubscriptions /></PrivateRoute>} />
        <Route path="/admin/classes" element={<PrivateRoute role="ROLE_ADMIN"><ClassManagement /></PrivateRoute>} />
        <Route path="/admin/bookings" element={<PrivateRoute role="ROLE_ADMIN"><AllBookings /></PrivateRoute>} />
        <Route path="/admin-plans" element={<PrivateRoute role="ROLE_ADMIN"><AdminPlansManager /></PrivateRoute>} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <h1 className="text-2xl text-red-500 font-bold">🚫 Access Denied</h1>
          </div>} 
        />
      </Routes>
    </Router>
  </>
);

export default App;
