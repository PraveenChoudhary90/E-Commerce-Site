import MarketingForm from './MarketingForm'
import React, { useState, useEffect } from "react";
import VideoSection from "./VideoSection";
import ImageSection from "./ImageSection";
import PdfSection from "./PdfSection";
import Footer1 from "../../components/Footer1";
import PageLoader from '../../components/ui/PageLoader';
import { fetchPromotion } from '../../api/auth-api';


const MarketingTool = () => {
    const [loading, setLoading] = useState(true);
    const [videoPromotions, setVideoPromotions] = useState([]);
    const [imagePromotions, setImagePromotions] = useState([]);
    const [pdfs, setPdfs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPromotion();
                if (response) {
                    setVideoPromotions(response.filter((item) => item.type === "video"));
                    setImagePromotions(response.filter((item) => item.type === "image"));
                    setPdfs(response.filter((item) => item.type === "pdf"));
                }
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            {loading ? (
                <PageLoader />
            ) : (
                <div className="p-3 flex flex-col gap-4 bg-white rounded-xl">
                    <MarketingForm />

                    {videoPromotions.length > 0 ? (
                        <VideoSection videos={videoPromotions} setVideoPromotions={setVideoPromotions} />
                    ) : (
                        <p className="text-gray-500 text-center">No video promotions found.</p>
                    )}

                    {imagePromotions.length > 0 ? (
                        <ImageSection images={imagePromotions} setImagePromotions={setImagePromotions} />
                    ) : (
                        <p className="text-gray-500 text-center">No image promotions found.</p>
                    )}

                    {pdfs.length > 0 ? (
                        <PdfSection pdfs={pdfs} setPdfs={setPdfs} />
                    ) : (
                        <p className="text-gray-500 text-center">No PDF promotions found.</p>
                    )}
                </div>
            )}
            <Footer1 />
        </div>
    );
};

export default MarketingTool;
