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
                <div className="flex h-full max-h-[280] w-full flex-col items-center justify-center rounded-xl bg-gray-800 p-6 text-center text-white shadow-md">
                  <p className="mb-4 max-w-36 text-2xl font-semibold">
                    Buka Tabungan Umrah Haji
                  </p>
                  <button className="bg-gradient rounded-full px-4 py-2 text-white">
                    Buka Tabungan
                  </button>
                </div>
                <div className="flex h-full max-h-[280] flex-col items-center justify-center rounded-xl bg-gray-800 p-6 text-center text-white shadow-md">
                  <p className="mb-4 max-w-36 text-2xl font-semibold">
                    Sudah Punya Akun Tabungan
                  </p>
                  <button className="bg-gradient rounded-full px-4 py-2 text-white">
                    Cek Tabungan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h2 className="mb-4 font-bold text-gray-800 max-lg:text-xl lg:text-2xl">
            Apa Itu Tabungan Umroh?
          </h2>
          <p className="mb-6 text-justify text-gray-700 max-lg:text-lg lg:text-xl">
            Tabungan umroh adalah produk simpanan yang diperuntukan bagi nasabah
            dengan tujuan menunaikan ibadah umroh pada waktu yang telah
            ditentukan. Cara kerja produk ini tak berbeda dengan produk tabungan
            haji maupun tabungan berjangka lain pada umumnya. Apabila produk
            menggunakan akad Mudharabah, Anda juga akan mendapatkan imbalan
            berupa bagi hasil. Setelah dana mencapai jumlah yang sesuai dengan
            nominal ongkos umroh, Anda dapat langsung menggunakannya untuk
            perjalanan ke Tanah Suci. Ibadah Umroh sendiri tidak harus menunggu
            antrian seperti halnya berhaji karena bisa dilakukan kapan pun.
            Tetapi, ada waktu tertentu yang menjadi favorit umat Islam untuk
            menunaikan ibadah umroh, seperti umroh saat bulan suci Ramadan,
            akhir tahun, dan awal tahun.
            {/* Anda bisa lengkapi deskripsi paragraf di sini */}
          </p>

          <h3 className="mb-4 text-2xl font-bold max-lg:text-xl">
            Ada beberapa tujuan dan manfaat membuka tabungan untuk umroh:
          </h3>
          <div className="space-y-4 text-2xl max-lg:text-xl">
            <div>
              <p className="text-xl font-semibold">
                1. Mengumpulkan Biaya Umroh Lebih Ringan
              </p>
              <p className="text-justify text-xl text-gray-700 max-lg:text-lg">
                Manfaat yang paling utama mengapa banyak orang membuka simpanan
                berjangka di bank syariah untuk umroh adalah menjadi salah satu
                cara mengumpulkan dana ke Tanah Suci. Melalui cara ini,
                mengumpulkan biaya umroh yang tidak sedikit ini pun menjadi jauh
                lebih ringan. Terlebih, bank syariah memberikan syarat setoran
                yang ringan, bebas biaya administrasi, dan bisa autodebet
                sehingga kita menjadi lebih disiplin.
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                2. Dana Tersimpan dengan Aman
              </p>
              <p className="text-justify text-xl text-gray-700 max-lg:text-lg">
                Mengumpulkan dana yang secara khusus ditujukan untuk ibadah
                umroh, akan lebih aman dibandingkan menyimpan uang sendiri.
                Apalagi jika bank syariah tempat Anda menyimpan dana simpanan
                umroh merupakan peserta Lembaga Penjamin Simpanan (LPS). LPS
                akan memberikan penjaminan pembayaran simpanan nasabah sampai
                jumlah Rp 2 miliar. Jadi, Anda tidak perlu khawatir uang akan
                hilang atau dicuri.
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                3. Setoran Lebih Fleksibel
              </p>
              <p className="text-justify text-xl text-gray-700 max-lg:text-lg">
                Biasanya, bank syariah akan memberikan kebebasan pada nasabahnya
                untuk menentukan besaran dana yang akan disetorkan setiap
                bulannya. Anda dapat menyesuaikan dengan kemampuan finansial.
                Sebelum menentukan setoran, buatlah estimasi biaya umroh
                kemudian hitung simulasinya. Jadi, bisa roh agar dana bisa
                terkumpul di waktu yang sudah tentukan. Dengan ini, kamu tidak
                akan kehilangan kesempatan pergi beribadah ke tanah suci di
                waktu target kamu.
              </p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                4. Kepastian Keberangkatan
              </p>
              <p className="text-justify text-xl text-gray-700 max-lg:text-lg">
                Berbeda dengan produk simpanan lainnya, tabungan umroh biasanya
                dirancang secara terprogram untuk memastikan keberangkatan
                nasabahnya. Bank yang memiliki produk tabungan berjangka umroh
                biasanya memiliki rekanan travel agent terpercaya. Selain untuk
                umroh, Anda bisa sekaligus merencanakan liburan ke negara yang
                berdekatan dengan Tanah Suci, seperti Turki dan Dubai
              </p>
            </div>
          </div>

          <div className="my-6 grid grid-cols-3 gap-4">
            <img
              src="src/assets/makkah-1.png"
              alt="Mekkah 1"
              className="w-full rounded-lg object-cover"
            />
            <img
              src="src/assets/makkah-1.png"
              alt="Mekkah 2"
              className="w-full rounded-lg object-cover"
            />
            <img
              src="src/assets/makkah-1.png"
              alt="Mekkah 3"
              className="w-full rounded-lg object-cover"
            />
          </div>

          <h3 className="my-4 text-xl font-bold">Cara Buka Tabungan Umroh</h3>
          <p className="mb-4 text-justify text-xl text-gray-700 max-lg:text-lg">
            Jika Anda tertarik mulai menabung untuk umroh, maka bisa mendatangi
            bank syariah yang dituju. Masing-masing bank syariah memiliki syarat
            dan ketentuan berbeda-beda. Adapun syarat membuka tabungan umroh
            sama seperti membuka produk simpanan lainnya. Anda bisa melakukan
            perencanaan tabungan umroh untuk satu hingga seluruh keluarga.
          </p>
          <p className="mb-4 text-xl text-gray-700 max-lg:text-lg">
            Berikut syarat umum pembukaan tabungan umroh di bank syariah:
          </p>
          <div className="space-y-1 text-xl text-gray-700 max-lg:text-lg">
            <p className="font-semibold">
              1.Melampirkan kartu identitas resmi (KTP).
            </p>
            <p className="font-semibold">2.NPWP.</p>
            <p className="font-semibold">
              3.Melakukan setoran awal sesuai ketentuan dari bank.
            </p>
            <p className="font-semibold">
              4.Mengisi dan menandatangani formulir pembukaan rekening secara
              lengkap dan benar.
            </p>
            <p className="font-semibold">
              5.Umumnya, jika tabungan sudah mencapai nominal tertentu, maka
              akan digunakan sebagai uang muka umroh sesuai dengan pilihan paket
              keberangkatan. Anda juga harus mempersiapkan dokumen lain yang
              biasanya akan diminta menjelang keberangkatan, seperti paspor asli
              atau bukti vaksin.
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 border-y-1 border-gray-300 py-4">
              <button className="bg-primary rounded-lg px-4 py-2 text-white">
                Buka Tabungan
              </button>
              <button className="bg-primary rounded-lg px-4 py-2 text-white">
                Cek Tabungan
              </button>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};
