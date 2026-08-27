import Navbar from "./Navbar";

function AdminLayout({ children }) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}

export default AdminLayout;