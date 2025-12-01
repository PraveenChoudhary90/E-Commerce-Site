import { useState } from "react";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import Swal from "sweetalert2";
import { addCategory } from "../../api/product-management-api";
import PageLoader from "../../components/ui/PageLoader";
import { imageBase64Convertor } from "../../utils/additionalFunction";

const AddCategories = () => {
  const [payload, setPayload] = useState({
    name: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const validateFields = () => {
    if (payload.name === "") {
      Swal.fire({
        title: "Error",
        text: "Category name is required!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (payload.image === "") {
      Swal.fire({
        title: "Error",
        text: "Category image is required!",
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
      await addCategory(payload);
      Swal.fire({
        icon: "success",
        title: "Category Added!",
        text: "Category Added Successfully",
      }).then(() => (
        window.location.reload()

      ))

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

        <div className="items-center justify-between flex">
          <div className="w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <InputField onChange={(e) => setPayload({ ...payload, name: e.target.value })} label={"Category Name"} value={payload.name} />

            <InputField
              type="file"
              label={"Category Image"}
              onChange={(e) => imageBase64Convertor(e, (imageBase64) => setPayload({ ...payload, image: imageBase64 }))}
            />
          </div>

          <div className="flex gap-3 col-span-2">
            <Button bgcolor={"bg-blue-500"} title={"Cancel"} />
            <Button onClick={handleSubmit} bgcolor={"bg-[#32C98D]"} title={"Save"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategories;
