import React, { useEffect, useState } from 'react';
import InventoryHero from './InventoryHero';
import TableComponent from './TableComponent';
import Footer1 from '../../components/Footer1';
import { getAllProductList } from '../../api/product-management-api';
import PageLoader from "../../components/ui/PageLoader";

const InventoryManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProductList()
      .then((res) => setData(res))
      .catch((err) => console.error("Error fetching product list:", err))
      .finally(() => setLoading(false)); // Hide loader once data is fetched
  }, []);

  const availableStock = data.filter((product) => product.stock > 0);
  const outOfStock = data.filter((product) => product.stock === 0);

  return (
    <div className="flex flex-col gap-7">
      {loading && <PageLoader />} {/* Show loader when loading */}
      {!loading && (
        <>
          <InventoryHero data={data} />
          {availableStock.length > 0 && (
            <TableComponent title="Available Stock" data={availableStock} />
          )}
          {outOfStock.length > 0 && (
            <TableComponent title="Out of Stock" data={outOfStock} />
          )}
          <Footer1 />
        </>
      )}
    </div>
  );
};

export default InventoryManagement;
