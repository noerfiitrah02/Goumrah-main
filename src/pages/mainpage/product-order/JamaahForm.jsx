import { Switch } from "@headlessui/react";
import { FaUser, FaUserPlus } from "react-icons/fa";

const JamaahForm = ({
  roomType,
  setRoomType,
  jamaahList,
  onChangeJamaah,
  onTambahJamaah,
  onHapusJamaah,
  isProfileUsedList,
  onToggleProfileUsed,
}) => {
  return (
    <div className="flex-1">
      <h2 className="mb-4 text-2xl font-bold">Pemesanan</h2>
      <div className="space-y-6">
        {jamaahList.map((jamaah, index) => (
          <div key={index} className="rounded-lg border border-gray-300">
            <div className="m-6 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary rounded-sm p-2 text-white">
                    <FaUser size={18} />
                  </div>
                  <h2 className="font-semibold">Jamaah {index + 1}</h2>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    *Apakah data sesuai dengan profile?
                  </span>
                  <Switch
                    checked={isProfileUsedList[index]}
                    onChange={() => onToggleProfileUsed(index)}
                    className={`${
                      isProfileUsedList[index] ? "bg-green-500" : "bg-gray-300"
                    } relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors`}
                  >
                    <span
                      className={`${
                        isProfileUsedList[index]
                          ? "translate-x-6"
                          : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>

                {index === 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jenis Kamar
                    </label>
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full border-b-2 border-gray-300 px-4 py-2 text-gray-700"
                    >
                      <option value="quad">1 Kamar 4 Orang (QUAD)</option>
                      <option value="triple">1 Kamar 3 Orang (TRIPLE)</option>
                      <option value="double">1 Kamar 2 Orang (DOUBLE)</option>
                    </select>
                  </div>
                )}

                <input
                  type="text"
                  name="namaLengkap"
                  value={jamaah.namaLengkap}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Nama Lengkap"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="nomorKTP"
                  value={jamaah.nomorKTP}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Nomor KTP"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <div className="grid grid-cols-2 gap-10">
                  <input
                    type="text"
                    name="tempatLahir"
                    value={jamaah.tempatLahir}
                    onChange={(e) => onChangeJamaah(index, e)}
                    placeholder="Tempat Lahir"
                    className="w-full border-b-2 border-gray-300 px-4 py-2"
                  />
                  <input
                    type="date"
                    name="tanggalLahir"
                    value={jamaah.tanggalLahir}
                    onChange={(e) => onChangeJamaah(index, e)}
                    className="w-full border-b-2 border-gray-300 px-4 py-2"
                  />
                </div>
                <input
                  type="text"
                  name="kota"
                  value={jamaah.kota}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Kota"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="kodePos"
                  value={jamaah.kodePos}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Kode Pos"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <select
                  name="jenisKelamin"
                  value={jamaah.jenisKelamin}
                  onChange={(e) => onChangeJamaah(index, e)}
                  className="w-full border-b-2 border-gray-300 px-4 py-2 text-gray-700"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
                <input
                  type="text"
                  name="pekerjaan"
                  value={jamaah.pekerjaan}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Pekerjaan"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="alamat"
                  value={jamaah.alamat}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Alamat"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="kontakDaruratNomor"
                  value={jamaah.kontakDaruratNomor}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Nomor Kontak Darurat"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="kontakDaruratNama"
                  value={jamaah.kontakDaruratNama}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Nama Kontak Darurat"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                <input
                  type="text"
                  name="hubunganDarurat"
                  value={jamaah.hubunganDarurat}
                  onChange={(e) => onChangeJamaah(index, e)}
                  placeholder="Hubungan dengan Jamaah"
                  className="w-full border-b-2 border-gray-300 px-4 py-2"
                />
                {jamaahList.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => onHapusJamaah(index)}
                      className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-800"
                    >
                      Hapus Jamaah {index + 1}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={onTambahJamaah}
          className="bg-primary mt-4 flex items-center gap-2 rounded-sm px-3 py-1 text-white"
        >
          <FaUserPlus size={18} />
          Tambah Jamaah
        </button>
      </div>
    </div>
  );
};

export default JamaahForm;
