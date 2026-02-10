import { useState } from "react";
import img from "../../assets/images/login11.jpg";
import { MainContent } from "../../constants/mainContent";
import { AiOutlineLock, AiOutlineMail, AiOutlineUnlock } from "react-icons/ai";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../components/ui/PageLoader";
import { loginWithEmailAdmin } from "../../api/auth-api";
import Swal from "sweetalert2";
import { Routers } from "../../constants/Routes";

import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slice/UserInfoSlice";

const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginWithEmailAdmin(data);

      localStorage.setItem("token", response?.token);

      const adminDetails = {
        name: response?.name,
        email: response?.email,
        role: response?.role,
        number: response?.number,
      };

      localStorage.setItem("userInfoadmin", JSON.stringify(adminDetails));
      dispatch(setUserInfo(adminDetails));

      Swal.fire({
        icon: "success",
        title: "Login Success",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => navigate(Routers.Dashboard),
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error?.response?.data?.message ||
          "Please check your email and password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}

      {/* ROOT */}
      <div className="relative w-screen h-screen overflow-hidden">
        {/* IMAGE */}
        <img
          src={img}
          alt="login-bg"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* CARD CONTAINER */}
        <div className="relative z-10 h-full flex items-center px-4 sm:px-8 md:px-12">
          <div
            className="w-full max-w-md pt-0 pb-8 px-6
            bg-[#081a33]/80 backdrop-blur-md
            rounded-3xl border border-[#1e3a8a]/40
            shadow-[0_0_30px_rgba(59,130,246,0.25)]
            flex flex-col items-center"
          >
            <img
              src={MainContent.logo}
              alt="logo"
              className="w-[180px] mb-2"
            />

            <p className="uppercase text-center text-sm text-blue-200">
              India&apos;s first B2B medi-commerce platform
            </p>

            <h1 className="text-xl font-semibold mt-4 mb-5 text-white uppercase">
              Admin Login
            </h1>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full"
              >
                {/* EMAIL */}
                <FormItem>
                  <FormLabel className="text-blue-200 text-sm">
                    Email Address
                  </FormLabel>
                  <div className="flex items-center bg-[#0b2550] rounded-md border border-white/10">
                    <FormControl>
                      <Input
                        {...form.register("email")}
                        placeholder="example@gmail.com"
                        className="bg-transparent text-white placeholder:text-blue-300 border-none shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <div className="p-3 bg-[#2563eb] rounded-md">
                      <AiOutlineMail className="text-white text-xl" />
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>

                {/* PASSWORD */}
                <FormItem>
                  <FormLabel className="text-blue-200 text-sm">
                    Password
                  </FormLabel>
                  <div className="flex items-center bg-[#0b2550] rounded-md border border-white/10">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        placeholder="Enter password"
                        className="bg-transparent text-white placeholder:text-blue-300 border-none shadow-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <div
                      className="p-3 bg-[#2563eb] rounded-md cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <AiOutlineUnlock className="text-white text-xl" />
                      ) : (
                        <AiOutlineLock className="text-white text-xl" />
                      )}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>

                {/* BUTTON */}
                <Button
                  type="submit"
                  className="w-full mt-2 py-2
                  bg-gradient-to-r from-[#2563eb] to-[#38bdf8]
                  hover:from-[#1d4ed8] hover:to-[#0ea5e9]
                  text-white font-semibold rounded-lg
                  shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                >
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
