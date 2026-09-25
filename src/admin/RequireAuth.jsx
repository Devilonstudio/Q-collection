import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/authActions";
import { isSupabaseConfigured } from "../lib/supabase";
import { SetupNotice, Loading } from "../components/DataState";

export default function RequireAuth() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) {
    return (
      <div style={{ paddingTop: "150px" }}>
        <SetupNotice />
      </div>
    );
  }

  if (loading) return <Loading label="Checking session…" />;

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
