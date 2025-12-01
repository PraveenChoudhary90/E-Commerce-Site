import { useEffect, useState } from "react";
import TableComponent from "./TableComponent";
import Footer1 from "../../components/Footer1";
import { getAllProductList } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";

const ProductList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        getAllProductList()
            .then((res) => {
                setData(res);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="flex flex-col gap-5">
            <TableComponent
                tittle={"All Product List"}
                data={data.sort((a, b) => a.brand.localeCompare(b.brand))}
            />
            <Footer1 />
        </div>
    );
};

export default ProductList;
