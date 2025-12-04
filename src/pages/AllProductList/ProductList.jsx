import { useEffect, useMemo, useState } from "react";
import TableComponent from "./TableComponent";
import Footer1 from "../../components/Footer1";
import { getAllProductList } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";

const safeString = (v) => {
  if (typeof v === "string") return v;
  if (v == null) return ""; 
  if (typeof v === "number") return String(v);
  return "";
};

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProductList()
      .then((res) => {
       
        setData(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
        setData([]); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sortedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    
    return [...data]
      
      .filter((item) => item && typeof item === "object")
      .sort((a, b) => {
        const brandA = safeString(a?.brand).trim();
        const brandB = safeString(b?.brand).trim();

        
        const aMissing = brandA === "";
        const bMissing = brandB === "";
        if (aMissing && !bMissing) return 1; 
        if (!aMissing && bMissing) return -1; 

        
        if (aMissing && bMissing) {
          const idA = typeof a?.id === "number" ? a.id : safeString(a?.id);
          const idB = typeof b?.id === "number" ? b.id : safeString(b?.id);
          if (!isNaN(Number(idA)) && !isNaN(Number(idB))) {
            return Number(idA) - Number(idB);
          }
          return String(idA).localeCompare(String(idB));
        }

       
        return brandA.localeCompare(brandB, undefined, { sensitivity: "accent" });
      });
  }, [data]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex flex-col gap-5">
      <TableComponent tittle={"All Product List"} data={sortedData} />
      <Footer1 />
    </div>
  );
};

export default ProductList;
