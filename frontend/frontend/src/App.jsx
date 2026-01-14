



// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./components/ProtectedRoute"
// import WelcomePage from "./assets/pages/public/WelcomePage";
// import HomePage from "./assets/pages/public/HomePage";
// import SignUp from "./assets/pages/public/SignUp";
// import Login from "./assets/pages/public/Login";
// import Dashboard from "./assets/pages/private/Dashboard";

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           <Route path="/" element={<WelcomePage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./assets/components/ProtectedRoute"; // ✅ CORRECT PATH
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
//           <Route path="/" element={<WelcomePage />} />
//           <Route path="/home" element={<HomePage />} />
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
          
//           {/* Protected Route - Only accessible when logged in */}
//           <Route 
//             path="/dashboard" 
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             } 
//           />

//           <Route 
//   path="/admin"
//   element={
//     <ProtectedRoute>
//       <AdminDashboard />
//     </ProtectedRoute>
//   }
// />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./assets/components/ProtectedRoute";
import WelcomePage from "./assets/pages/public/WelcomePage";
import HomePage from "./assets/pages/public/HomePage";
import SignUp from "./assets/pages/public/SignUp";
import Login from "./assets/pages/public/Login";
import Dashboard from "./assets/pages/private/Dashboard";
import AdminDashboard from "./assets/pages/private/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          
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