import Link from "next/link";
import AdminForm from "../../../../components/admin-form";
export default function NewProperty() {
  return (
    <main className="adminPage">
      <aside className="adminSide">
        <b>⌂ LandHub Admin</b>
        <nav>
          <Link href="/">⌂ Dashboard</Link>
          <Link href="/">▣ Properties</Link>
          <Link className="active" href="/admin/properties/new">
            ＋ Add New Property
          </Link>
          <Link href="/contact">▤ Enquiries</Link>
          <Link href="/">⚙ Settings</Link>
          <Link href="/">⇥ Logout</Link>
        </nav>
      </aside>
      <section className="adminContent">
        <div className="adminHead">
          <b>☰</b>
          <span>Add New Property</span>
        </div>
        <div className="crumb">Dashboard › Add New Property</div>
        <AdminForm />
      </section>
    </main>
  );
}
