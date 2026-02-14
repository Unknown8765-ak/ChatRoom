import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function ProtectedRoute() {
  const { status,loading } = useSelector((state) => state.auth)
    console.log("AUTH STATE 👉", status, "LOADING 👉", loading);

  
  if (loading) {
    return <div>Checking authentication...</div>;
  }

  if (!status) {

    return <Navigate to="/login" replace />
  }

  // User logged in
  return <Outlet />
}

export default ProtectedRoute

