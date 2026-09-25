import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "../lib/authActions";
import logo from "../assets/logo.png";
import "./admin.css";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <img src={logo} alt="" />
          <span>The Q Collection</span>
        </div>
        <nav className="admin__nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/categories">Categories</NavLink>
          <NavLink to="/admin/products">Products</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
        </nav>
        <div className="admin__sidebar-foot">
          <a href="/" target="_blank" rel="noreferrer">View live site &#8599;</a>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="admin__content">
        <Outlet />
      </main>
    </div>
  );
}
