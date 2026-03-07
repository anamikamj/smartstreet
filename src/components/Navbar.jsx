import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          SmartStreet
        </div>
        <ul className="nav-links">
          <li><a href="#danger-map">Danger Map</a></li>
          <li><a href="#report">Report Hazard</a></li>
          <li><a href="#watch">Watch Me</a></li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="sos-btn" onClick={() => navigate("/sos")}>SOS</button>
        <button className="icon-btn">🔔</button>
        <button className="icon-btn" onClick={() => navigate("/login")}>👤</button>
      </div>
    </nav>
  );
}

export default Navbar;