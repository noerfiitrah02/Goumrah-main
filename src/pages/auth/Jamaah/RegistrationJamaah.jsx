import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../../assets/logo.png";
import Step1Email from "../../../components/auth/Step1Email";
import Step2VerifyCode from "../../../components/auth/Step2VerifyCode";
import Step3PhonePassword from "../../../components/auth/Step3PhonePassword";
import Step4PersonalData from "../../../components/auth/Step4PersonalData";
import ConfirmationModal from "../../../components/common/ConfirmationModal";

const RegistrationJamaah = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const totalSteps = 3;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep1 = () => {
    setStep(2);
    scrollToTop();
  };

  const handleNextStep2 = (token) => {
    setTempToken(token);
    setStep(3);
    scrollToTop();
  };

  const handleEditEmail = () => {
    setStep(1);
    scrollToTop();
  };

  const handleNextStep3 = (token) => {
    setAuthToken(token);
    localStorage.setItem("authToken", token);
    setStep(4);
    scrollToTop();
  };

  const handleComplete = () => {
    navigate("/login", {
      state: {
        email,
      },
      replace: true,
    });
  };

  const handleClose = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
    navigate("/daftar");
  };

  const handleCancelCancel = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="m-auto flex min-h-screen max-w-[1064px] flex-col px-4 sm:px-6 lg:px-8">
      <div className="mt-10 mb-8 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={logoImage} className="h-11" alt="Logo GoUmrah" />

          {step <= 3 && (
            <div className="hidden items-center space-x-2 sm:flex">
              {[...Array(totalSteps)].map((_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === step;
                const isCompleted = stepNumber < step;

                return (
                  <div key={stepNumber} className="flex items-center">
                    {/* Step Circle */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-green-600 text-white"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        stepNumber
                      )}
                    </div>

                    {stepNumber < totalSteps && (
                      <div
                        className={`h-0.5 w-8 transition-colors ${
                          stepNumber < step ? "bg-green-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {step <= 3 && (
            <span className="text-sm text-gray-500">
              Langkah {step}/{totalSteps}
            </span>
          )}

          {step <= 3 && (
            <button
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
              aria-label="Tutup registrasi"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="w-full rounded-lg bg-white p-6">
        <div className="mx-auto flex w-full flex-col py-8">
          <h2 className="mb-4 text-2xl font-bold">Pendaftaran Jamaah</h2>
          <p className="mb-8 text-gray-600">
            Isi data pendaftaran. Proses ini hanya membutuhkan beberapa menit.
            Anda hanya perlu menyiapkan nomor telepon dan email.
          </p>

          {step === 1 && (
            <Step1Email
              email={email}
              setEmail={setEmail}
              onNext={handleNextStep1}
            />
          )}

          {step === 2 && (
            <Step2VerifyCode
              email={email}
              code={code}
              setCode={setCode}
              onNext={handleNextStep2}
              onEdit={handleEditEmail}
            />
          )}

          {step === 3 && (
            <Step3PhonePassword
              email={email}
              phone={phone}
              setPhone={setPhone}
              password={password}
              setPassword={setPassword}
              tempToken={tempToken}
              onNext={handleNextStep3}
            />
          )}

          {step === 4 && (
            <Step4PersonalData
              authToken={authToken}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCancelCancel}
        onConfirm={handleConfirmCancel}
        title="Konfirmasi Pembatalan"
        message="Apakah Anda yakin ingin membatalkan registrasi?"
        confirmText="Ya, Batalkan"
        cancelText="Batal"
      />
    </div>
  );
};

export default RegistrationJamaah;
