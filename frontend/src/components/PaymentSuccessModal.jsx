import React from 'react'

const PaymentSuccessModal = ({ isOpen, onClose, email = "nina@gmail.com" }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-[1116px] h-auto max-h-[90vh] overflow-hidden">
        {/* Main Background Container */}
        <div
          className="w-full h-[400px] md:h-[500px] lg:h-[624px] rounded-[20px] relative"
          style={{ 
            background: "linear-gradient(to bottom, #fff 18.1%, #ccc 99.99%, #999 100%)" 
          }}
        >
          {/* Success Card */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-[748px] bg-[#4e7cb2] rounded-[20px] px-6 md:px-16 lg:px-[124px] py-8 mx-4">
              <div className="flex flex-col items-center gap-6 md:gap-8 lg:gap-11">
                {/* Check Icon */}
                <div className="w-32 h-32 md:w-40 md:h-40 lg:w-[169px] lg:h-[174px] flex items-center justify-center">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 170 174"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                  >
                    <path
                      d="M84.7916 10.8486C44.0214 10.8486 10.9635 44.851 10.9635 86.7861C10.9635 128.721 44.0214 162.724 84.7916 162.724C125.562 162.724 158.62 128.721 158.62 86.7861C158.62 44.851 125.562 10.8486 84.7916 10.8486ZM116.679 61.9878L81.9736 111.483C81.4886 112.179 80.8491 112.747 80.1083 113.138C79.3674 113.529 78.5466 113.734 77.7137 113.734C76.8808 113.734 76.0599 113.529 75.3191 113.138C74.5783 112.747 73.9388 112.179 73.4537 111.483L52.9038 82.1926C52.2776 81.2942 52.9038 80.0399 53.975 80.0399H61.7039C63.3848 80.0399 64.9833 80.8705 65.972 82.2943L77.7054 99.0412L103.611 62.0895C104.6 60.6826 106.182 59.8351 107.879 59.8351H115.608C116.679 59.8351 117.306 61.0894 116.679 61.9878Z"
                      fill="white"
                    />
                  </svg>
                </div>

                {/* Success Text */}
                <div className="text-center space-y-4">
                  <h2 className="text-xl md:text-2xl lg:text-[28px] font-bold text-white">
                    Your payment has been successful!
                  </h2>
                  <p className="text-base md:text-lg lg:text-xl text-white">
                    Receipt has been sent to {email}
                  </p>
                </div>

                {/* Next Button */}
                <button
                  onClick={onClose}
                  className="w-full max-w-[249px] h-[70px] relative mt-4 md:mt-8"
                >
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 257 78"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0"
                  >
                    <g filter="url(#filter0_d_213_4)">
                      <path
                        d="M232.25 0H24.75C13.2901 0 4 8.17567 4 18.2609V51.7391C4 61.8243 13.2901 70 24.75 70H232.25C243.71 70 253 61.8243 253 51.7391V18.2609C253 8.17567 243.71 0 232.25 0Z"
                        fill="#E84797"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_213_4"
                        x={0}
                        y={0}
                        width={257}
                        height={78}
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                      >
                        <feFlood floodOpacity={0} result="BackgroundImageFix" />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy={4} />
                        <feGaussianBlur stdDeviation={2} />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_213_4" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_213_4" result="shape" />
                      </filter>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl lg:text-[32px] font-bold text-white">
                    Next
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Decorative Images */}
          {/* Left Cat Image */}
          <img
            src="/popup.svg"
            alt="Success Cat Left"
            className="hidden lg:block w-32 h-32 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] absolute left-4 lg:left-[166.5px] bottom-4 lg:bottom-[32px] object-cover"
          />
          
          {/* Right Cat Image */}
          <img
            src="/popup.svg"
            alt="Success Cat Right"
            className="hidden lg:block w-32 h-32 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] absolute right-4 lg:right-[166.5px] bottom-4 lg:bottom-[32px] object-cover"
          />
        </div>

        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl font-bold transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccessModal