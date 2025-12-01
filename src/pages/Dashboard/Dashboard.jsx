import { useEffect, useState } from "react";
import bgimage2 from "../../assets/dashboard/bgimage2.svg";
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
import { getDashboardDetails, getSellerListToVerify } from "../../api/auth-api";
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
      title: "New Joined Retailers (Today)",
      value: dashboardStats?.todaysUsers || 0,
      symbol: dashboardStats?.todaysUsers > 0 ? "+" : "",
      icon: <FaUser />,
    },
    {
      title: "Total Retailers",
      value: dashboardStats?.totalUsers || 0,
      symbol: "",
      icon: <FaUser />,
    }
  ];

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardDetails();
      setDashboardStats(res?.data?.[0]);
      setMemberLists(res?.members);
      setTopProducts(res?.topProducts);
      setTopBrands(res?.topBrands);
      setTopCategories(res?.topCategories);
      setBanner(res?.banners)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        const vendordata = await getSellerListToVerify();
        dispatch(setVendorData(vendordata));
      } catch (error) {
        console.error("Error fetching franchisee Data:", error);
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || "Error fetching franchisee dta",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchVendorData();
  }, [dispatch]);

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
