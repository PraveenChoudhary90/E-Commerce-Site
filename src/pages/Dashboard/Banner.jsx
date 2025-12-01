import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Banner = ({ banner }) => {

    return (
        <div className="">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                // navigation
                // pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop
                className=""
            >
                {banner?.map((data, index) => (
                    <SwiperSlide key={index}>
                        <div  className="grid lg:grid-cols-3 bg-white p-5 rounded-xl gap-4 md:grid-cols-2 grid-cols-1">
                            <div className="w-full  flex flex-col gap-2 items-start ">
                                <div>
                                    <h1 className=""><b>Banner Name:</b> {data?.banner_name}</h1>
                                    <h1 className=""><b>Banner Discount:</b> {data?.discount}</h1>
                                </div>
                               
                            </div>

                            <div className="w-full min-h-64 rounded-xl bg-blue-200 overflow-hidden">
                                <img src={data?.images[0]} className="w-full h-full object-cover" alt="Offer 1" />
                            </div>

                            <div className="w-full min-h-64 rounded-xl bg-blue-200 overflow-hidden">
                                <img src={data?.images[1]} className="w-full h-full object-cover" alt="Offer 2" />
                            </div>
                        </div>

                    </SwiperSlide>
                ))}

            </Swiper>
        </div>
    );
};

export default Banner;
