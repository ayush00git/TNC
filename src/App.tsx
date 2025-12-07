import HomePage from "./components/HomePage";
import PillNav from "./components/PillNav";
import logo from "./assets/react.svg";

function App() {
  return (
    <>
      <PillNav
        logo={logo}
        logoAlt="Company Logo"
        items={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Contact", href: "/contact" },
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#ffffff"
        pillColor="#000000"
        hoveredPillTextColor="#000000"
        pillTextColor="#ffffff"
      />
      <HomePage />
    </>
  );
}

export default App;
