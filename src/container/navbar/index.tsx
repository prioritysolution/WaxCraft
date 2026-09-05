import { useNavbar } from "./Hooks";
import Navbar from "@/components/navbar";
const NavbarContainer = () => {
  const { loading, handleLogout } = useNavbar();

  return <Navbar loading={loading} handleLogout={handleLogout} />;
};
export default NavbarContainer;
