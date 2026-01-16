import { useState } from "react";
import img from "../../assets/images/login11.png";
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

// Redux
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/slice/UserInfoSlice";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await loginWithEmailAdmin(data);

      // Save token in localStorage
      localStorage.setItem("token", response?.token);

      // Prepare admin info
      const adminDetails = {
        name: response?.user?.firstname,
        email: response?.user?.email,
        role: response?.user?.role,
      };

      // Save admin info in localStorage
      localStorage.setItem("userInfoadmin", JSON.stringify(adminDetails));

      // Save admin info in Redux Toolkit
      dispatch(setUserInfo(adminDetails));

      form.reset({ email: "", password: "" });

      Swal.fire({
        icon: "success",
        title: "Login Success",
        text: "You have logged in successfully",
        timer: 3000,
        willClose: () => {
          navigate(Routers.Dashboard);
          window.location.reload();
        },
      });
    } catch (error) {
      console.error("Error:", error?.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error?.response?.data?.message || "Please check your email and password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div
        className="w-screen h-screen xl:p-20 flex items-center lg:p-16 md:p-10 p-4"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full md:w-2/6 py-10 p-4 bg-[#ffffff6a] backdrop-blur-md rounded-3xl border shadow-[0_0_10px_rgba(0,0,0,0.1)] flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <img src={MainContent.logo} alt="Pharama Logo" className="w-[200px] h-auto" />
          </div>
          <p className="uppercase text-center text-sm md:text-base font-semibold mx-auto break-words text-ellipsis">
            India&apos;s first B2B medi-commerce platform
          </p>
          <h1 className="text-xl font-semibold text-center mt-5 mb-2 uppercase">Admin Login</h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mb-5">
              {/* EMAIL INPUT */}
              <FormItem>
                <FormLabel className="text-sm font-light text-[#555555]">Email Address</FormLabel>
                <div className="flex items-center justify-between bg-[#fbfdfe] rounded-md border border-input">
                  <FormControl>
                    <Input
                      placeholder="example@pharamasatti.com"
                      {...form.register("email")}
                      className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <div className={`p-3 rounded-md ${form.formState.errors.email ? "bg-red-500" : "bg-bg-color"}`}>
                    <AiOutlineMail className="text-white text-2xl" />
                  </div>
                </div>
                <FormMessage className="h-4">{form.formState.errors.email?.message || ""}</FormMessage>
              </FormItem>

              {/* PASSWORD INPUT */}
              <FormItem>
                <FormLabel className="text-sm font-light text-[#555555]">Password</FormLabel>
                <div className="flex items-center justify-between bg-[#fbfdfe] rounded-md border border-input">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register("password")}
                      className="bg-transparent border-none outline-none shadow-none focus-visible:ring-0"
                    />
                  </FormControl>
                  <div
                    className={`p-3 rounded-md cursor-pointer ${form.formState.errors.password ? "bg-red-500" : "bg-bg-color"}`}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <AiOutlineUnlock className="text-white text-2xl" /> : <AiOutlineLock className="text-white text-2xl" />}
                  </div>
                </div>
                <FormMessage className="h-4">{form.formState.errors.password?.message || ""}</FormMessage>
              </FormItem>

              <Button type="submit" className="whitespace-nowrap w-full py-2 px-10 bg-bg-color text-white font-semibold rounded-lg text-lg">
                Login
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
