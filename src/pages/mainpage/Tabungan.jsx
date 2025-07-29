import { Layout } from "../../components/layout/Layout";

export const Tabungan = () => {
  return (
    <>
      <Layout page="Tabungan">
        <div>
          <div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Kolom Gambar */}
              <div className="flex flex-col gap-4 md:col-span-2">
                <img
                  src="/spanduk-promosi-paket-umrah-1.png"
                  alt="Tabungan Umrah"
                  className="w-full rounded-xl object-cover shadow-lg"
                />
                <img
                  src="/spanduk-promosi-paket-umrah-2.png"
                  alt="Rombongan Umroh"
                  className="w-full rounded-xl object-cover shadow-lg"
                />
              </div>

              {/* Kolom Aksi */}
              <div className="flex flex-col justify-around gap-4">
                <div className="flex h-full max-h-[280px] w-full flex-col items-center justify-center rounded-xl bg-gray-800 p-6 text-center text-white shadow-md">
                  <p className="mb-4 max-w-36 text-xl leading-tight font-semibold">
                    Buka Tabungan Umrah Haji
                  </p>
                  <button className="bg-gradient rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105">
                    Buka Tabungan
                  </button>
                </div>
                <div className="flex h-full max-h-[280px] flex-col items-center justify-center rounded-xl bg-gray-800 p-6 text-center text-white shadow-md">
                  <p className="mb-4 max-w-36 text-xl leading-tight font-semibold">
                    Sudah Punya Akun Tabungan
                  </p>
                  <button className="bg-gradient rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105">
                    Cek Tabungan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="mt-8 space-y-8">
          {/* Penjelasan Utama */}
          <section>
            <h2 className="mb-6 text-2xl font-bold text-gray-800 lg:text-3xl">
              Apa Itu Tabungan Umroh?
            </h2>
            <p className="text-justify text-lg leading-relaxed text-gray-700">
              Tabungan umroh adalah produk simpanan yang diperuntukan bagi
              nasabah dengan tujuan menunaikan ibadah umroh pada waktu yang
              telah ditentukan. Cara kerja produk ini tak berbeda dengan produk
              tabungan haji maupun tabungan berjangka lain pada umumnya. Apabila
              produk menggunakan akad Mudharabah, Anda juga akan mendapatkan
              imbalan berupa bagi hasil. Setelah dana mencapai jumlah yang
              sesuai dengan nominal ongkos umroh, Anda dapat langsung
              menggunakannya untuk perjalanan ke Tanah Suci. Ibadah Umroh
              sendiri tidak harus menunggu antrian seperti halnya berhaji karena
              bisa dilakukan kapan pun. Tetapi, ada waktu tertentu yang menjadi
              favorit umat Islam untuk menunaikan ibadah umroh, seperti umroh
              saat bulan suci Ramadan, akhir tahun, dan awal tahun.
            </p>
          </section>

          {/* Tujuan dan Manfaat */}
          <section>
            <h3 className="mb-6 text-xl font-bold text-gray-800 lg:text-2xl">
              Tujuan dan Manfaat Membuka Tabungan untuk Umroh
            </h3>
            <div className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  1. Mengumpulkan Biaya Umroh Lebih Ringan
                </h4>
                <p className="text-justify leading-relaxed text-gray-700">
                  Manfaat yang paling utama mengapa banyak orang membuka
                  simpanan berjangka di bank syariah untuk umroh adalah menjadi
                  salah satu cara mengumpulkan dana ke Tanah Suci. Melalui cara
                  ini, mengumpulkan biaya umroh yang tidak sedikit ini pun
                  menjadi jauh lebih ringan. Terlebih, bank syariah memberikan
                  syarat setoran yang ringan, bebas biaya administrasi, dan bisa
                  autodebet sehingga kita menjadi lebih disiplin.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  2. Dana Tersimpan dengan Aman
                </h4>
                <p className="text-justify leading-relaxed text-gray-700">
                  Mengumpulkan dana yang secara khusus ditujukan untuk ibadah
                  umroh, akan lebih aman dibandingkan menyimpan uang sendiri.
                  Apalagi jika bank syariah tempat Anda menyimpan dana simpanan
                  umroh merupakan peserta Lembaga Penjamin Simpanan (LPS). LPS
                  akan memberikan penjaminan pembayaran simpanan nasabah sampai
                  jumlah Rp 2 miliar. Jadi, Anda tidak perlu khawatir uang akan
                  hilang atau dicuri.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  3. Setoran Lebih Fleksibel
                </h4>
                <p className="text-justify leading-relaxed text-gray-700">
                  Biasanya, bank syariah akan memberikan kebebasan pada
                  nasabahnya untuk menentukan besaran dana yang akan disetorkan
                  setiap bulannya. Anda dapat menyesuaikan dengan kemampuan
                  finansial. Sebelum menentukan setoran, buatlah estimasi biaya
                  umroh kemudian hitung simulasinya. Jadi, dana bisa terkumpul
                  di waktu yang sudah ditentukan. Dengan ini, Anda tidak akan
                  kehilangan kesempatan pergi beribadah ke tanah suci di waktu
                  target Anda.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6">
                <h4 className="mb-3 text-lg font-semibold text-gray-800">
                  4. Kepastian Keberangkatan
                </h4>
                <p className="text-justify leading-relaxed text-gray-700">
                  Berbeda dengan produk simpanan lainnya, tabungan umroh
                  biasanya dirancang secara terprogram untuk memastikan
                  keberangkatan nasabahnya. Bank yang memiliki produk tabungan
                  berjangka umroh biasanya memiliki rekanan travel agent
                  terpercaya. Selain untuk umroh, Anda bisa sekaligus
                  merencanakan liburan ke negara yang berdekatan dengan Tanah
                  Suci, seperti Turki dan Dubai.
                </p>
              </div>
            </div>
          </section>

          {/* Cara Buka Tabungan */}
          <section>
            <h3 className="mb-6 text-xl font-bold text-gray-800 lg:text-2xl">
              Cara Buka Tabungan Umroh
            </h3>
            <div className="space-y-4">
              <p className="text-justify text-lg leading-relaxed text-gray-700">
                Jika Anda tertarik mulai menabung untuk umroh, maka bisa
                mendatangi bank syariah yang dituju. Masing-masing bank syariah
                memiliki syarat dan ketentuan berbeda-beda. Adapun syarat
                membuka tabungan umroh sama seperti membuka produk simpanan
                lainnya. Anda bisa melakukan perencanaan tabungan umroh untuk
                satu hingga seluruh keluarga.
              </p>

              <div className="rounded-lg bg-blue-50 p-6">
                <h4 className="mb-4 text-lg font-semibold text-gray-800">
                  Syarat Umum Pembukaan Tabungan Umroh:
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      1
                    </span>
                    <p className="text-gray-700">
                      Melampirkan kartu identitas resmi (KTP)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      2
                    </span>
                    <p className="text-gray-700">NPWP</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      3
                    </span>
                    <p className="text-gray-700">
                      Melakukan setoran awal sesuai ketentuan dari bank
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                      4
                    </span>
                    <p className="text-gray-700">
                      Mengisi dan menandatangani formulir pembukaan rekening
                      secara lengkap dan benar
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-6">
                <h4 className="mb-3 text-lg font-semibold text-amber-800">
                  📋 Informasi Tambahan:
                </h4>
                <p className="text-amber-700">
                  Setelah tabungan mencapai nominal tertentu, dana akan
                  digunakan sebagai uang muka umroh sesuai dengan pilihan paket
                  keberangkatan. Anda juga perlu mempersiapkan dokumen lain
                  menjelang keberangkatan, seperti paspor asli dan bukti vaksin.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Siap Memulai Perjalanan Spiritual Anda?
            </h3>
            <p className="mb-6 text-gray-700">
              Mulai menabung untuk umroh impian Anda hari ini juga
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="bg-primary rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Buka Tabungan
              </button>
              <button className="bg-primary rounded-lg px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Cek Tabungan
              </button>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};
