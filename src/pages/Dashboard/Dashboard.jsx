import { useEffect, useState } from "react";
// import bgimage2 from "../../assets/dashboard/bgimage2.svg";
import TourismAchievement from "./TourismAchievement";
import HeaderStats from "./HeaderStats";
import AdminMembers from "./AdminMembers";
import RetailorMembers from "./RetailorMembers";
import Notifications from "./NotificationCard";
import TopStats from "../../components/TopStats";
import Footer1 from "../../components/Footer1";
import Banner from "./Banner";
import Chart from "./Chart";
import Graph from "./Graph";
import { getSellerListToVerify, getOrderDetails } from "../../api/auth-api";
import PageLoader from "../../components/ui/PageLoader";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaFileAlt, FaGlobe, FaUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setVendorData } from "../../redux/slice/vendorManagementSlice";
import Swal from "sweetalert2";
import ReferalButton from "./ReferalButton";
import { LiaRupeeSignSolid } from "react-icons/lia";

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [memberLists, setMemberLists] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topBrands, setTopBrands] = useState([]);
  const [banner, setBanner] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const stats = [
    {
      title: "Today's Sales",
      value: dashboardStats?.todaysSales?.toFixed(2) || 0,
      symbol: "₹",
      icon: <LiaRupeeSignSolid />,
    },
    {
      title: "Total Sales",
      value: dashboardStats?.totalSales?.toFixed(2) || 0,
      symbol: "₹",
      icon: <LiaRupeeSignSolid />,
    },
    {
      title: "New Joined Vendors (Today)",
      value: dashboardStats?.todaysUsers || 0,
      symbol: dashboardStats?.todaysUsers > 0 ? "+" : "",
      icon: <FaUser />,
    },
    {
      title: "Total Vendors",
      value: dashboardStats?.totalUsers || 0,
      symbol: "",
      icon: <FaUser />,
    }
  ];

  // ✅ 1. Fetch Orders & calculate Today's Sales and Total Sales
  const fetchSalesFromOrders = async () => {
  try {
    const res = await getOrderDetails();
    const orders = res?.data || res || []; // same as OrderHistory

    let todaysSales = 0;
    let totalSales = 0;

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    orders.forEach((order) => {
      if (order.status !== "SUCCESS") return;

      const amount = Number(order.totalAmount || 0);
      totalSales += amount;

      const orderDate = new Date(order.createdAt);

      // Compare year, month, day in local timezone
      if (
        orderDate.getFullYear() === todayYear &&
        orderDate.getMonth() === todayMonth &&
        orderDate.getDate() === todayDate
      ) {
        todaysSales += amount;
      }
    });

    console.log("TODAY SALES:", todaysSales, "TOTAL SALES:", totalSales);

    return { todaysSales, totalSales };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { todaysSales: 0, totalSales: 0 };
  }
};


  // ✅ 2. Fetch Vendors & calculate Today's and Total Vendors
  const fetchVendorStats = async () => {
    const res = await getSellerListToVerify();
    const vendors = res?.data || [];
    const today = new Date().toISOString().split("T")[0];

    const totalUsers = vendors.length;

    const todaysUsers = vendors.filter(
      (v) => v?.createdAt?.split("T")[0] === today
    ).length;

    return { totalUsers, todaysUsers };
  };

  // ✅ 3. Combine Sales and Vendor stats
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const salesData = await fetchSalesFromOrders();
      const vendorData = await fetchVendorStats();

      setDashboardStats({
        todaysSales: salesData.todaysSales,
        totalSales: salesData.totalSales,
        todaysUsers: vendorData.todaysUsers,
        totalUsers: vendorData.totalUsers,
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: "Error fetching dashboard stats",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ 4. Fetch Dashboard Data (members, topProducts, topBrands, etc.)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // If you have another API to fetch members/topProducts, call it here
      // Example: const res = await getDashboardDetails();
      // setMemberLists(res?.members);
      // setTopProducts(res?.topProducts);
      // setTopBrands(res?.topBrands);
      // setTopCategories(res?.topCategories);
      // setBanner(res?.banners)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 5. Fetch Vendor Data to Redux store
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const vendordata = await getSellerListToVerify();
        dispatch(setVendorData(vendordata));
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || "Error fetching vendor data",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [dispatch]);

  // ✅ 6. Fetch dashboard stats on mount
  useEffect(() => {
    fetchDashboardStats();
    fetchDashboardData();
  }, []);

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-7">
        <HeaderStats data={stats} />
        <ReferalButton/>
        {/* <Chart /> */}
        <div className="col-span-2 lg:col-span-1">
          <RetailorMembers />
        </div>
        <AdminMembers
          data={memberLists}
          adminListHangler={fetchDashboardData}
        />

        {/* <Notifications /> */}
        {/* <TourismAchievement img={bgimage2} bgcolor={"bg-[#ffffffc4]"} />
        <Graph /> */}
        {/* <TopStats topProducts={topProducts} topBrands={topBrands} topCategories={topCategories} /> */}
        {/* <Banner banner={banner} /> */}
        <Footer1 />
      </div>
    </>
  );
};

export default Dashboard;
