import RecordSaleForm from "../components/dashboard/RecordSaleForm";
import InventoryTable from "../components/dashboard/InventoryTable";
import TodaysSalesTable from "../components/dashboard/TodaysSalesTable";

export default function StorekeeperDashboard() {
  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-2xl font-bold mb-6'>Storekeeper Dashboard</h1>

      <div className='grid md:grid-cols-2 gap-6 mb-6'>
        <RecordSaleForm />
        <TodaysSalesTable />
      </div>

      <InventoryTable />
    </div>
  );
}
