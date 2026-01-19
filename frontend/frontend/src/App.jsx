


// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./assets/components/ProtectedRoute";
// import WelcomePage from "./assets/pages/public/WelcomePage";
// import HomePage from "./assets/pages/public/HomePage";
// import SignUp from "./assets/pages/public/SignUp";
// import Login from "./assets/pages/public/Login";
// import Dashboard from "./assets/pages/private/Dashboard";
// import AdminDashboard from "./assets/pages/private/AdminDashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/" element={<WelcomePage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
          
//           {/* Protected Dashboard Routes */}
//           <Route 
//             path="/dashboard/*" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Admin Route */}
//           <Route 
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;



// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";
// import ProtectedRoute from "./assets/components/ProtectedRoute";
// import WelcomePage from "./assets/pages/public/WelcomePage";
// import HomePage from "./assets/pages/public/HomePage";
// import SignUp from "./assets/pages/public/SignUp";
// import Login from "./assets/pages/public/Login";
// import Dashboard from "./assets/pages/private/Dashboard";
// import AdminDashboard from "./assets/pages/private/AdminDashboard";

// // Smart Root Component - Redirects based on authentication
// function RootRedirect() {
//   const { user, loading } = useAuth();

//   // Show loading while checking authentication
//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '1.5rem',
//         color: '#667eea'
//       }}>
//         Loading...
//       </div>
//     );
//   }

//   // If logged in, redirect based on role
//   if (user) {
//     if (user.role === 'admin') {
//       return <Navigate to="/admin" replace />;
//     }
//     return <Navigate to="/dashboard" replace />;
//   }

//   // If not logged in, show welcome page
//   return <WelcomePage />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Smart Root Route - Auto-redirects if logged in */}
//           <Route path="/" element={<RootRedirect />} />
          
//           {/* Public Routes */}
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
          
//           {/* Protected Dashboard Routes */}
//           <Route 
//             path="/dashboard/*" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />

//           {/* Admin Route */}
//           <Route 
//             path="/admin"
//             element={
//               <ProtectedRoute>
//                 <AdminDashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import WelcomePage from "./assets/pages/public/WelcomePage";
import HomePage from "./assets/pages/public/HomePage";
import SignUp from "./assets/pages/public/SignUp";
import Login from "./assets/pages/public/Login";
import ForgetPassword from "./assets/pages/public/ForgetPassword"; // ADD THIS
import ResetPassword from "./assets/pages/public/ResetPassword"; // ADD THIS
import Dashboard from "./assets/pages/private/Dashboard";
import AdminDashboard from "./assets/pages/private/AdminDashboard";

// Smart Root Component - Redirects based on authentication
function RootRedirect() {
  const { user, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#667eea'
      }}>
        Loading...
      </div>
    );
  }

  // If logged in, redirect based on role
  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, show welcome page
  return <WelcomePage />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Smart Root Route - Auto-redirects if logged in */}
          <Route path="/" element={<RootRedirect />} />
          
          {/* Public Routes */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} /> {/* ADD THIS */}
          <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ADD THIS */}
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Admin Route */}
          <Route 
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;