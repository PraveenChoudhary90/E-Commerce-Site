import { useState } from "react";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Swal from "sweetalert2";
import { addCategoryBrand } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import { imageBase64Convertor } from "../../utils/additionalFunction";
import SelectComponent from "../../components/SelectComponent";

const AddCategoryBrand = () => {
  const [payload, setPayload] = useState({
    name: "",
    image: "",
    category: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);
  const validateFields = () => {
    if (payload.category === "") {
      Swal.fire({
        title: "Error",
        text: "Category is required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (payload.type === "") {
      Swal.fire({
        title: "Error",
        text: "Type is required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
    if (payload.name === "") {
      Swal.fire({
        title: "Error",
        text: "Brand name is required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (payload.image === "") {
      Swal.fire({
        title: "Error",
        text: "Brand image is required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }
    

    return true;
  };
  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      setLoading(true);
      await addCategoryBrand(payload);
      Swal.fire({
        icon: "success",
        title: "Brand Added!",
        text: "Brand Added Successfully",
      });
      setPayload({
        name: "",
        image: "",
        type: "",
        category: "",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <PageLoader />}
      <div className="space-y-7">
        <div className="bg-white rounded-lg shadow-lg w-full md:w-1/2 mx-auto p-5 space-y-5">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h4 className="lg:text-lg  md:text-base text-sm font-medium ">
              Product Category
            </h4>
          </div>
          <div className="grid lg:grid-col-1">
            <SelectComponent placeholder={"Select Category"} onChange={(e) => setPayload({ ...payload, category: e.target.value })} options={["Cold Cheston", "Dolo"]} value={payload.category} label={"Select Category"} name={"category"} />
            <SelectComponent placeholder={"Select Type"} onChange={(e) => setPayload({ ...payload, type: e.target.value })} options={["Cold Cheston", "Dolo"]} value={payload.type} label={"Select Type"} name={"type"} />
            <InputField
              onChange={(e) => setPayload({ ...payload, name: e.target.value })}
              label={"Brand Name"}
            />
            <InputField
              type="file"
              label={"Brand Image"}
              onChange={(e) =>
                imageBase64Convertor(e, (imageBase64) =>
                  setPayload({ ...payload, image: imageBase64 })
                )
              }
            />
          </div>
          <div className="flex gap-4 items-center justify-center">
            <Button
              onClick={handleSubmit}
              bgcolor={"bg-[#32C98D]"}
              title={"Add Category Brand"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryBrand;
