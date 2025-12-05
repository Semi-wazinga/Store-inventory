import RecordSaleForm from "../components/dashboard/RecordSaleForm";
import InventoryTable from "../components/dashboard/InventoryTable";
import TodaysSalesTable from "../components/dashboard/TodaysSalesTable";

export default function StorekeeperDashboard() {
  return (
    <div className='container-small'>
      <header className='mb-4'>
        <h1 className='fw-semibold' style={{ fontSize: "1.5rem" }}>
          Storekeeper Dashboard
        </h1>
      </header>

      <section className='dashboard-grid mb-4'>
        <RecordSaleForm />
        <TodaysSalesTable />
      </section>

      <section className='mb-4'>
        <InventoryTable />
      </section>
    </div>
  );
}
