import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Routers } from "./constants/Routes";
import Register from "./pages/Register/Register";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard/Dashboard";
import InventoryManagement from "./pages/InventoryManagement/InventoryManagement";
import ProductList from "./pages/AllProductList/ProductList";
import Login from "./pages/Login/Login";
import CheckoutPage from "./pages/CheckOut/CheckoutPage";
import VendorRegister from "./pages/Register/VendorRegister";
import VerifyBankDetails from "./pages/Register/VerifyBankDetails";
import ManageMembers from "./pages/ManageMembers/ManageMembers";
import ContentManagement from "./pages/ContentManagement/ContentManagement";
import EmailManagement2 from "./pages/EmailManagement/EmailManagement2";
import EmailManagement1 from "./pages/EmailManagement/EmailManagement1";
import EarningManagement from "./pages/EarningManagement/EarningManagement";
import AddProduct from "./pages/AddProduct/AddProduct";
import ScrollToTop from "./components/ScrollToTop";
import AddCategories from "./pages/AddProduct/AddCategories";
import AddCategoryTypes from "./pages/AddProduct/AddCategoryTypes";
import AddCategoryBrand from "./pages/AddProduct/AddCategoryBrand";
import AddProductManagement from "./pages/AddProductManagement/AddProductManagement";
import VendorManagement from "./pages/VendorManagement/VendorManagement";
import Notifications from "./pages/Notification/Notifications";
import NotFound from "./components/NotFound";
import VendorManagementForm from "./pages/VendorManagement/VendorManagementForm";
import MemberProfile from "./pages/ManageMembers/MemberProfile";
import AddCoupon from "./pages/Coupon/AddCoupon";
import RewardManagement from "./pages/RewardManagement/RewardManagement";
import MarketingTool from "./pages/MarketingTool/MarketingTool";
import AllGetImages from "./pages/MarketingTool/AllGetImages";
import AllGetVideos from "./pages/MarketingTool/AllGetVideos";
import AllGetPdf from "./pages/MarketingTool/AllGetPdf";
import OfferManagement from "./pages/Coupon/OfferManagement";
import StaticBanner from "./pages/StaticBanner/StaticBanner";
import ReferralManagement from "./pages/ReferralManagement";
import GalleryManagement from "./pages/GalleryManagement/GalleryManagement";


const RoutersPages = () => {
  const token = "localStorage.getItem()";
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {token === null || token === "" || token === undefined ? (
          <>
            <Route path={Routers.Login} element={<Login />} />
            <Route path={Routers.Register} element={<Register />} />
            <Route path={Routers.VendorRegister} element={<VendorRegister />} />
            <Route
              path={Routers.VerifyBankDetails}
              element={<VerifyBankDetails />}
            />
            <Route path="*" element={<Navigate to={Routers.Login} replace />} />
          </>
        ) : (
          <>
            <Route path={Routers.Dashboard} element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route
                path={Routers.ContentManagement}
                element={<ContentManagement />}
              />
                <Route path={Routers.GALLERY_MANAGEMENT} element={<GalleryManagement />} />
               <Route
                path={Routers.STATIC_BANNER}
                element={<StaticBanner/>}
              />
              <Route
                path={Routers.EmailManagement}
                element={<EmailManagement1 />}
              />
                <Route
                path={Routers.REFERRAL_MANAGEMENT}
                element={<ReferralManagement />}
              />
              <Route
                path={Routers.EarningManagement}
                element={<EarningManagement />}
              />
              <Route
                path={Routers.EmailMessage}
                element={<EmailManagement2 />}
              />
              <Route
                path={Routers.InventoryManagement}
                element={<InventoryManagement />}
              />
              <Route path={Routers.ProductList} element={<ProductList />} />
              {/* <Route path={Routers.CheckOut} element={<CheckoutPage />} /> */}
              <Route path={Routers.ManageMembers} element={<ManageMembers />} />
              <Route path={Routers.MembersProfile} element={<MemberProfile />} />
              <Route path={Routers.AddProduct} element={<AddProduct />} />
              <Route path={Routers.AddCategories} element={<AddCategories />} />
              <Route path={Routers.AddCategoryType} element={<AddCategoryTypes />} />
              <Route path={Routers.AddCategoryBrand} element={<AddCategoryBrand />} />
              <Route path={Routers.VendorManagement} element={<VendorManagement />} />
              <Route path={Routers.Notification} element={<Notifications />} />
              <Route path={Routers.ADD_COUPON} element={<OfferManagement />} />
              <Route path={Routers.REWARD_MANAGEMENT} element={<RewardManagement />} />
              <Route path={Routers.VendorDetails} element={<VendorManagementForm />} />
              <Route
                path={Routers.MarketingTool}
                element={<MarketingTool />}
              />
              <Route
                path={Routers.MarketingToolAllVideos}
                element={<AllGetVideos />}
              />
              <Route
                path={Routers.MarketingToolAllImages}
                element={<AllGetImages />}
              />
              <Route
                path={Routers.MarketingToolAllPdf}
                element={<AllGetPdf />}
              />
            </Route>
            <Route path={Routers.NotFound} element={<NotFound />} />
            <Route path="*" element={<Layout />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default RoutersPages;
