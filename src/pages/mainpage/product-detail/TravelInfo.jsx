import React from "react";
const TravelInfo = ({data}) => {
  const travel = {
    name: data?.travel?.travel_name,
    phone: data?.travel?.phone_number,
    email: data?.travel?.email,
    logo: data?.travel?.logo, // Ganti sesuai path logo kamu
  };

  return (
    <div className="flex items-start justify-between rounded-xl bg-white p-4 shadow-lg">
      <div className="flex basis-full items-start space-x-4">
        <img
          src={travel.logo}
          alt={travel.name}
          className="w-16 h-16 rounded-full  object-cover"
        />
        <div className="flex w-full items-center justify-between flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{travel.name}</h2>
            <p className="mt-1 text-sm text-gray-600">{travel.phone}</p>
            <p className="text-sm text-gray-600">{travel.email}</p>
          </div>
          <div className="py-2">
            <button className="rounded-md border-3 border-green-600 px-4 py-2 text-sm font-medium text-green-700">
              Kunjungi Travel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelInfo;
