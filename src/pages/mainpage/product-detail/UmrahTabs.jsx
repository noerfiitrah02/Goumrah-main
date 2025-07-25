import { useState } from "react";
import {
  FaCalendarDay,
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaHotel,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

function UmrahTabs({ data }) {
  const [activeTab, setActiveTab] = useState("description");
  const [imageError, setImageError] = useState(false);

  const tabs = [
    { key: "description", label: "DESCRIPTION" },
    { key: "itinerary", label: "ITINERARY" },
    { key: "flight", label: "PENERBANGAN" },
    { key: "hotel", label: "HOTEL" },
    { key: "terms", label: "SYARAT & KONDISI" },
  ];

  const tabContent = {
    description: (
      <div className="space-y-4">
        <div>
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <FaCheckCircle className="text-primary" />
            Harga Termasuk:
          </div>
          <ul className="ml-6 list-disc">
            {JSON.parse(data?.includes || "[]").map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-1 flex items-center gap-2 font-semibold">
            <FaTimesCircle className="text-red-500" />
            Tidak Termasuk:
          </div>
          <ul className="ml-6 list-disc">
            {JSON.parse(data?.excludes || "[]").map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    ),

    itinerary: (
      <div className="space-y-4">
        {data?.itineraries?.map((item, index) => (
          <div key={index} className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <FaCalendarDay className="mt-1 text-green-600" size={18} />
              <div>
                <p className="font-semibold text-gray-800">
                  Hari ke-{item.day}: {item.title}
                </p>
                <p className="text-sm text-gray-600">{item.description}</p>
                {item.location && (
                  <p className="mt-1 flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                    {item.location}
                  </p>
                )}
              </div>
            </div>
            {index < data.itineraries.length - 1 && (
              <div className="ms-2 leading-none">
                |<br />|
              </div>
            )}
          </div>
        ))}
      </div>
    ),

    flight: (
      <div className="space-y-4">
        {data?.flights?.map((flight, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {!imageError && flight.airline?.logo ? (
              <img
                src={`http://localhost:5000/${flight.airline.logo}`}
                alt={flight.airline.name}
                className="h-10 w-10 rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <FaPlaneDeparture className="mt-1 text-green-600" size={20} />
            )}

            <div>
              <p className="font-semibold">
                {flight.airline?.name} - {flight.flight_number}
              </p>
              <p className="text-sm text-gray-600">
                {flight.departure_airport} <br />⇨ (
                {new Date(flight.departure_datetime).toLocaleString()})
                <br />
                {flight.arrival_airport}
                <br />⇨ ({new Date(flight.arrival_datetime).toLocaleString()})
              </p>
            </div>
          </div>
        ))}
      </div>
    ),

    hotel: (
      <div className="space-y-4">
        {data?.hotels?.map((item, i) => (
          <div
            key={i}
            className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            {!imageError && item.hotel?.images?.[0]?.image_path ? (
              <img
                src={`http://localhost:5000/${item.hotel.images[0].image_path}`}
                alt={item.hotel.name}
                className="h-10 w-10 rounded-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <FaHotel size={20} className="mt-1 text-green-600" />
            )}

            <div>
              <p className="font-semibold">
                {item.hotel?.name} ({item.hotel?.stars}★)
              </p>
              <p className="text-sm text-gray-600">{item.hotel?.address}</p>
              <p className="text-sm text-gray-600">
                Check-in: {item.check_in_date} - Check-out:{" "}
                {item.check_out_date}
              </p>
              {item.hotel?.map_url && (
                <a
                  href={item.hotel.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm text-blue-500"
                >
                  <FaMapMarkerAlt /> Lihat di Maps
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    ),

    terms: (
      <div
        className="prose text-justify text-gray-700"
        dangerouslySetInnerHTML={{ __html: data?.terms_conditions }}
      />
    ),
  };

  return (
    <div className="mt-8">
      <div className="scrollbar-none flex overflow-x-auto border-b border-gray-200 px-4 text-sm font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`-mb-px border-b-2 px-4 py-2 whitespace-nowrap ${
              activeTab === tab.key
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-green-600"
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6 px-2 text-sm text-gray-800">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

export default UmrahTabs;
