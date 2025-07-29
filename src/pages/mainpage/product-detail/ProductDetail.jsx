import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutSecond } from "../../../components/layout/Layout";
import UmrahPackage from "./UmrahPackage";
import UmrahTabs from "./UmrahTabs";
import api from "../../../utils/api";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";

export const ProductDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/packages/${id}`);
      setPackageData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      toast.error("Gagal memuat data produk");
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <LayoutSecond page="Produk - Detail">
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner />
        </div>
      </LayoutSecond>
    );
  }

  return (
    <LayoutSecond page="Produk - Detail">
      <div className="w-full bg-[#f8f9fa]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-white shadow-md">
            <UmrahPackage data={packageData} />
          </div>

          <div className="mt-8 rounded-lg bg-white shadow-md">
            <UmrahTabs data={packageData} />
          </div>
        </div>
      </div>
    </LayoutSecond>
  );
};
