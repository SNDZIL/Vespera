import Image from "next/image";

export default function HomePage() {
  return (
    <div className="grotesk max-w-8xl mx-auto">
      {/* Hero 区域 */}
      <section className="w-full text-black">
        <div className="max-w-8xl mx-auto inline-block items-center p-3 pt-0 lg:flex lg:flex-wrap lg:pt-4 lg:my-10">
          <div className="lg:w-3/6">
            <h1 className="max-w-xl lg:text-[4.2em] text-3xl font-bold leading-none text-black inline-block">
              Experience Next-Generation Confidential Tokens
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-semibold text-[#404040]">
              SIGHT Confidential ERC20 leverages cutting-edge Sight Oracle with
              Fully Homomorphic Encryption to secure your token transactions
              while preserving your privacy.
            </p>
          </div>
          <div className="mb-10 mt-10 hidden w-full flex-col lg:mt-12 lg:inline-block lg:w-3/6">
            <Image
              src="/images/homepage.jpg"
              width={2048}
              height={1365}
              className="w-full h-auto"
              alt="CERC20"
            />
          </div>
          <div className="my-10 inline-block w-full flex-col lg:mt-0 lg:hidden lg:w-2/5">
            <Image
              src="/images/homepage.jpg"
              alt="CERC20"
              width={2048}
              height={1365}
            />
          </div>
        </div>

        {/* 介绍内容 */}
        <div className="mt-0 bg-white lg:mt-20">
          <div className="mx-auto">
            <div className="mx-auto px-5 py-4 lg:px-24 lg:pt-24">
              <div className="my-4 flex w-full flex-col text-center">
                <h2 className="mb-5 text-2xl font-bold text-black lg:text-3xl">
                  Bringing Privacy and Security to Blockchain Transactions
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-16">
                {/* <div className="hidden items-center justify-center lg:inline-block">
                  <img
                    src="/images/fhe.png"
                    alt="FHE"
                    className="block h-24 object-contain"
                  />
                </div>
                <div className="hidden items-center justify-center lg:inline-block">
                  <img
                    src="/images/sightlogo.svg"
                    alt="Sight"
                    className="block h-24 object-contain"
                  />
                </div> */}
                <div className="flex items-center justify-center">
                  <Image
                    src="/images/sightlogo.svg"
                    width={127}
                    height={47}
                    alt="Sight"
                    className="block h-24 object-contain"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Image
                    src="/images/CCTF.jpg"
                    alt="CCTF"
                    width={160}
                    height={160}
                    className="block h-24 object-contain"
                  />
                </div>
              </div>

              <div className="mb-6 flex w-full flex-col text-center">
                <a
                  href="https://sightai.io/"
                  className="underline-blue mb-8 text-xl font-bold text-black"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>

          {/* 详细产品介绍 */}
          {/* 详细产品介绍 */}
          <div className="text-black">
            <div className="max-w-9xl mx-auto flex flex-col items-center justify-center px-5">
              <div className="mr-0 mb-6 w-full py-4 text-center lg:w-2/3">
                <div>
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                    Fully Homomorphic Encryption
                  </h2>
                  <p className="mb-4 text-lg leading-relaxed">
                    Fully Homomorphic Encryption (FHE) is a cutting-edge
                    encryption technology that allows computations to be
                    performed directly on encrypted data without the need to
                    decrypt it first. This ensures data remains secure during
                    processing and transmission.
                  </p>
                </div>
                <div className="mt-4 w-full flex-col lg:mt-4 lg:inline-block lg:w-full">
                  <Image
                    src="/images/FHE.png"
                    alt="FHE"
                    width={2513}
                    height={1238}
                    className="home-intro-image"
                  />
                </div>
              </div>

              <div className="mr-0 mb-6 w-full py-4 text-center lg:w-2/3">
                <div>
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                    Sight Oracle: Decentralized Computation
                  </h2>
                  <p className="mb-4 text-lg leading-relaxed">
                    Sight Oracle is a Computational Oracle that allows users to
                    delegate computations on encrypted data using Fully
                    Homomorphic Encryption (FHE). Compatible with various
                    heterogeneous blockchain networks and supporting multiple
                    FHE schemes like CKKS and TFHE, Sight Oracle ensures
                    security and fairness for the decentralized web.
                  </p>
                </div>
                <div className="mt-4 w-full flex-col lg:mt-4 lg:inline-block lg:w-full">
                  <Image
                    src="/images/Sight Oracle.png"
                    alt="Sight Oracle"
                    width={2235}
                    height={933}
                    className="home-intro-image"
                  />
                </div>
              </div>

              <div className="mr-0 mb-6 w-full py-4 text-center lg:w-2/3">
                <div>
                  <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
                    Confidential ERC20 Contract
                  </h2>
                  <p className="mb-4 text-lg leading-relaxed">
                    The Confidential ERC20 Contract extends the standard ERC20
                    by incorporating FHE and the Sight Oracle. Sensitive data
                    such as token balances and transaction amounts are encrypted
                    to ensure maximum security.
                  </p>
                </div>
                <div className="mb-10 mt-4 w-full flex-col lg:mt-4 lg:inline-block lg:w-full">
                  <Image
                    src="/images/homepage.jpg"
                    alt="ERC20"
                    width={2048}
                    height={1365}
                    className="home-intro-image"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 呼吁行动区域 */}
        <div className="mx-auto px-5 pt-10 pb-8 lg:px-24 py-24">
          <div className="my-3 flex w-full flex-col text-left lg:text-center">
            <h2 className="bold mb-8 text-4xl font-bold leading-tight text-black lg:text-6xl">
              Discover the Future of Confidential Tokens
            </h2>
          </div>
          <div className="flex w-full flex-col text-left lg:text-center">
            <h3 className="text-2xl text-black">
              Join us to experience enhanced privacy and security with SIGHT
              Confidential ERC20.
            </h3>
          </div>
          <div className="flex w-full flex-row justify-center pt-24 text-center">
            <a
              href="/faucet"
              className="underline-blue px-8 text-xl font-semibold text-black"
            >
              Get Started
            </a>
          </div>
        </div>

        {/* 额外内容 */}
        <div className="bg-white text-black">
          <div className="mx-auto mb-16 flex flex-col items-center px-5 pt-20 lg:flex-row">
            <div className=" flex flex-col text-left lg:mb-0 lg:w-1/2 lg:flex-grow lg:items-start">
              <h2 className="mb-4 text-4xl font-bold leading-none sm:text-5xl">
                A Future Built on Privacy and Security
              </h2>
              <p className="font-3xl mb-8 font-semibold leading-relaxed">
                SIGHT Confidential ERC20 is at the forefront of blockchain
                privacy, offering fully encrypted transactions and enhanced
                security.
              </p>
            </div>
            <div className="lg:w-full lg:max-w-2xl">
              <Image
                src="/images/future.png"
                alt="Future"
                width={2048}
                height={842}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
