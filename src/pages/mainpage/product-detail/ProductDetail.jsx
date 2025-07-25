import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LayoutSecond } from "../../../components/layout/Layout";
import UmrahPackage from "./UmrahPackage";
import UmrahTabs from "./UmrahTabs";
import TravelInfo from "./TravelInfo";

export const ProductDetail = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/packages/${id}`)
      .then((res) => setPackageData(res.data.data))
      .catch((err) => console.error("Gagal fetch data:", err));
  }, [id]);

  return (
    <LayoutSecond page="Produk - Detail">
      <div className="w-full overflow-hidden bg-[#EAEAEB]">
        <div className="m-auto w-full max-w-[1064px] px-6 py-10">
          <UmrahPackage data={packageData} />
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <div className="m-auto w-full max-w-[1064px] px-6 py-10">
          <TravelInfo data={packageData}/>
          <UmrahTabs data={packageData} />
        </div>
      </div>
    </LayoutSecond>
  );
};
