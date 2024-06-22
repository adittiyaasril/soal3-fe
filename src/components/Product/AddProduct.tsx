"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import { Product } from "@/types/product";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@nextui-org/progress";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

type ResourceInfo =
  | {
      secure_url: string;
    }
  | undefined;

const AddProduct = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useState<string | undefined>(undefined);

  const [product, setProduct] = useState<Partial<Product>>({
    image: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      category: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(`https://soal3-be.vercel.app/products`, product);
      toast.success("Product added successfully", {
        onClose: () => {
          router.push("/product");
        },
      });
    } catch (error: any) {
      console.error(
        "Error adding product:",
        error.response?.data || error.message,
      );
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <ToastContainer autoClose={1000} transition={Bounce} />
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Add Product</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label
              htmlFor="productName"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <SelectGroupOne handleCategoryChange={handleCategoryChange} />

          <div className="mb-4.5">
            <label
              htmlFor="productImage"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Product Image
            </label>
            <CldUploadWidget
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result, { widget }) => {
                const info = result?.info as ResourceInfo;
                if (info) {
                  setResource(info.secure_url);
                  setProduct((prevProduct) => ({
                    ...prevProduct,
                    image: info.secure_url,
                  }));
                } else {
                  console.error("Upload succeeded but no info received.");
                }
                widget.close(); // Ensure the widget is closed after successful upload
              }}
            >
              {({ open }) => {
                return (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="mb-2 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  >
                    Upload an Image
                  </button>
                );
              }}
            </CldUploadWidget>
            {resource && (
              <div className="mt-2 max-w-[200px]">
                <Image
                  src={resource}
                  alt="Product Preview"
                  width={200}
                  height={200}
                  layout="responsive"
                />
              </div>
            )}
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="productStock"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Stock
            </label>
            <input
              type="text"
              id="productStock"
              name="stock"
              value={product.stock}
              onChange={handleInputChange}
              placeholder="Enter stock"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label
              htmlFor="productPrice"
              className="mb-3 block text-sm font-medium text-black dark:text-white"
            >
              Price
            </label>
            <input
              type="text"
              id="productPrice"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
          >
            {isLoading ? (
              <CircularProgress size="sm" color="success" />
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
