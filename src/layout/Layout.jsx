import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSignOutAlt, FaHome } from "react-icons/fa";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { BiAddToQueue, BiShare, BiSolidShoppingBags } from "react-icons/bi";
import { MdContentPasteGo, MdManageAccounts, MdOutlineInventory, MdOutlineSearch, MdOutlineBorderAll } from "react-icons/md";
import { GrMoney } from "react-icons/gr";
import { HiOutlineMailOpen } from "react-icons/hi";
import { RiCoupon2Line } from "react-icons/ri";
import { FiChevronsLeft, FiChevronsRight } from "react-icons/fi";
import { FaProductHunt } from "react-icons/fa6";
import defaultProfile from "../assets/manageMembers/b1.jpg";
import { MainContent } from "../constants/mainContent";
import PageLoader from "../components/ui/PageLoader";
import { Routers } from "../constants/Routes";
import { setUserInfo } from "../redux/slice/UserInfoSlice";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo.userInfoadmin);

  // Page title formatting
  let page = location.pathname.split("/")[1];
  page = page
    ? page.charAt(0).toUpperCase() + page.slice(1)
    : "Dashboard";
  page = page.replace(/-/g, " ");
  page = page
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { path: Routers.Dashboard, label: "Dashboard", icon: <FaHome /> },
    { path: Routers.UserList, label: "User Management", icon: <BiSolidShoppingBags /> },
    // { path: Routers.VENDOR_MANAGEMENT, label: "Vendor Management", icon: <BiSolidShoppingBags /> },
    { path: Routers.AddProduct, label: "Add Product", icon: <BiAddToQueue /> },
    { path: Routers.ProductDisplay, label: "Manage All Product", icon: <FaProductHunt /> },
    { path: Routers.HISTORY, label: "Order Details", icon: <MdOutlineBorderAll /> },
    // { path: Routers.INVENTORY_MANAGEMENT, label: "Inventory Report", icon: <MdOutlineInventory /> },
    // { path: Routers.AllIncome, label: "All Income", icon: <GrMoney /> },
    // { path: Routers.REFERRAL_MANAGEMENT, label: "Marketing Plans", icon: <BiShare /> },
    // { path: Routers.REWARD_MANAGEMENT, label: "Reward Management", icon: <HiOutlineMailOpen /> },
    { path: Routers.CONTENT_MANAGEMENT, label: "Banners", icon: <MdContentPasteGo /> },
    // { path: Routers.GALLERY_MANAGEMENT, label: "Gallery Management", icon: <MdContentPasteGo /> },
    // { path: Routers.EARNING_MANAGEMENT, label: "Accounts", icon: <GrMoney /> },
    { path: Routers.ADD_COUPON, label: "Offer Management", icon: <RiCoupon2Line /> },
    // { path: Routers.MANAGE_MEMBERS, label: "MR Management", icon: <MdManageAccounts /> },
    { path: Routers.ChangePassword, label: "Change Password", icon: <MdManageAccounts /> },
  ];

  const actionButtons = [
    // {
    //   label: "All Enquiries",
    //   icon: <IoIosNotificationsOutline />,
    //   bgColor: "bg-[#94E9B8]",
    //   func: () => navigate(Routers.Notification),
    // },
    {
      label: "Logout",
      icon: <FaSignOutAlt />,
      bgColor: "bg-[#F04B4B]",
      func: () => {
        // Redux logout
        dispatch(setUserInfo(null));
        localStorage.removeItem("token");
        localStorage.removeItem("userInfoadmin");
        navigate(Routers.Login, { replace: true });
      },
    },
  ];

  return (
    <>
      {loading && <PageLoader />}
 <div className="flex gap-4 justify-end w-full h-screen bg-bg-color1">
  {/* Sidebar */}
  <div className="md:pl-5 md:py-5">
    <div className={`absolute md:relative w-full z-50 h-full bg-white md:rounded-xl flex duration-300 flex-col ${!isSidebarOpen ? "md:left-0 -left-full" : "md:-left-full left-0"}`}>
      
      {/* Profile */}
      <div className="p-4 flex">
        <div className="w-full h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 overflow-hidden rounded-md">
              <img src={defaultProfile} alt="" className="h-full object-cover w-full" />
            </div>
            <div className="text-xs">
              <p className="whitespace-wrap capitalize">{userInfo?.name || "User"}</p>
              <p className="text-xs opacity-50 capitalize">{userInfo?.role || "User"}</p>
            </div>
          </div>

          {/* Sidebar Toggle Button (visible on mobile/tablet) */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-lg focus:outline-none bg-bg-color text-white rounded-md p-1 ml-5"
          >
            {isSidebarOpen ? <FiChevronsLeft /> : <FiChevronsRight />}
          </button>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 text-sm text-gray-400">MANAGEMENT</div>
      <nav className="scrollbar-left flex-1 overflow-y-auto">
        <ul className="space-y-2 py-2 px-4">
          {menuItems.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <Link
                  onClick={() => setIsSidebarOpen(false)} // Close sidebar on link click
                  to={path}
                  className={`flex items-center gap-2 hover:gap-3 transition-gap duration-300 rounded-2xl p-2 group text-xs ${isActive ? "bg-bg-color text-white font-medium" : "text-[#454751]/70 hover:bg-bg-color hover:text-white font-light"}`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-white text-bg-color" : "bg-gray-200"}`}>{icon}</div>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Actions */}
      <div className="px-4 py-2 space-y-1">
        <p className="text-gray-400 text-sm">OTHERS</p>
        {actionButtons.map(({ label, icon, bgColor, func }, index) => (
          <div key={index} className="p-2">
            <button onClick={func} className="flex w-full items-center text-[#101616] duration-500 transition-all gap-2 text-xs font-medium">
              <div className={`p-2 ${bgColor} text-base text-white rounded-lg`}>{icon}</div>
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Logo */}
      <div className="p-4 flex justify-center items-center">
        <img src={MainContent.logo} alt="Pharma Logo" className="w-[200px] h-auto" />
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className={`flex flex-col w-full duration-200 ${isSidebarOpen ? "w-full" : "md:w-[calc(100%-280px)]"} flex-shrink-0`}>
    <main className="overflow-y-auto px-2">
      <header className="flex items-center pt-3 justify-between my-2">
        <div className="flex items-center gap-2">
          {/* Sidebar toggle button on mobile/tablet */}
          <button 
            onClick={toggleSidebar}
            className={`text-lg focus:outline-none bg-bg-color text-white rounded-md p-1 ${isSidebarOpen ? "block" : "md:hidden"}`}
          >
            <FiChevronsRight />
          </button>

          {/* Page Title */}
          <div className="flex flex-col gap-2">
            <p className="text-xs opacity-50">Pages</p>
            <p className="text-bg-color font-bold text-lg px-2">{page}</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="items-center px-2 md:flex hidden bg-white rounded-xl overflow-hidden">
            <MdOutlineSearch />
            <input type="text" placeholder=" Type" className="py-3 px-1 outline-none text-sm" />
          </div>
        </div>
      </header>
      <Outlet />
    </main>
  </div>
</div>

    </>
  );
};

export default Layout;
