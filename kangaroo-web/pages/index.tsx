import React from "react";
import Footer from "../components/Footer";

const LandingPage = (): JSX.Element => {
  return (
    <div className="flex flex-col min-h-screen antialiased">
      <main className="flex-grow">
        <div className="text-white bg-pattern">
          <div className="container px-10 mx-auto xl:px-64">
            <nav className="flex items-center justify-between py-8 space-x-2">
              <div>
                <div className="text-3xl font-bold tracking-tight text-white">
                  Kangaroo
                </div>
                <div className="text-gray-400 text-uppercase">BETA</div>
              </div>
              <div className="flex space-x-6">
                <a className="font-semibold tracking-wide">Home</a>
                <a
                  className="font-semibold tracking-wide text-gray-300 hover:text-yellow-300"
                  href={"/login"}
                >
                  Login
                </a>
              </div>
            </nav>

            <section className="flex flex-col py-24 xl:items-center xl:flex-row xl:px-32 xl:space-x-16">
              <div className="flex justify-center hidden w-1/2 xl:flex">
                <div>
                  <img className="w-72" src={"preview.png"} alt="preview" />
                </div>
              </div>
              <div className="space-y-4 xl:w-1/2">
                <div className="text-4xl font-extrabold leading-snug">
                  The best sticker app for all platforms.
                </div>
                <div className="text-lg text-gray-100">
                  Make sticker packs with your friends collaboratively and use
                  them on any popular messenger. Whatsapp. Signal. Telegram.
                </div>
                <div>
                  <span className="px-4 py-1 font-semibold tracking-wide text-white bg-indigo-500 rounded-full">
                    Beta Downloads
                  </span>
                </div>
                <div className="flex flex-col xl:flex-row xl:space-x-2">
                  <div className="flex items-center justify-center w-48 mt-3 text-black bg-white rounded-lg h-14">
                    <div className="mr-3">
                      <svg viewBox="30 336.7 120.9 129.2" width="30">
                        <path
                          fill="#FFD400"
                          d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                        />
                        <path
                          fill="#FF3333"
                          d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                        />
                        <path
                          fill="#48FF48"
                          d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                        />
                        <path
                          fill="#3BCCFF"
                          d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">GET IT ON</div>
                      <div className="-mt-1 font-sans text-xl font-semibold">
                        Google Play
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-48 mt-3 text-black bg-white rounded-lg h-14">
                    <div className="mr-3">
                      <svg viewBox="0 0 384 512" width="30">
                        <path
                          fill="currentColor"
                          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="-mt-1 font-sans text-2xl font-semibold">
                        App Store
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <section className="px-10 py-16 mx-auto xl:container xl:px-64 xl:py-32">
          <section className="bg-white dark:bg-gray-800">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:grid-cols-3">
                <div>
                  <svg
                    className="w-8 h-8 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>

                  <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                    Collect with your friends!
                  </h1>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Save and share all your favorite stickers in collaborative
                    packs. Keep all your inside jokes stored and organized
                    safely.
                  </p>
                </div>

                <div>
                  <svg
                    className="w-8 h-8 text-gray-700"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>

                  <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                    Support for all major apps
                  </h1>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Using multiple messaging apps is no problem; we support all
                    the major ones and will support more in the future.
                  </p>
                </div>

                <div>
                  <svg
                    className="w-8 h-8 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>

                  <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                    Discover and Share
                  </h1>

                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    Discover and download the most popular packs; follow and
                    keep up to date with your favorites.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>

      <div>
        <div className="container mx-auto xl:px-64">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
