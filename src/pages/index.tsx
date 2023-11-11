import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { trpc } from "../utils/trpc";
import Image from "next/image";
import { useEffect, useState } from "react";

const useDisablePinchZoomEffect = () => {
  useEffect(() => {
    const disablePinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", disablePinchZoom, {
      passive: false,
    });
    return () => {
      document.removeEventListener("touchmove", disablePinchZoom);
    };
  }, []);
};

const Home: NextPage = () => {
  const [displayTop, setDisplayTop] = useState(true);
  useDisablePinchZoomEffect();
  return (
    <>
      <Head>
        <title>Reflexion iFrame Test</title>
        <meta
          name="description"
          content="A page to be able to test reflexion in an iFrame"
        />
        {/* <meta
          httpEquiv="Content-Security-Policy"
          content="script-src 'self' uastaging.reflexion.us 'unsafe-eval' 'unsafe-inline' blob:; child-src uastaging.reflexion.us blob:; worker-src blob:;font-src *"
        /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="justify-top flex min-h-screen flex-col items-center bg-gradient-to-b from-[#000000] to-[#194329]">
        <div className="justify-top container mt-20 flex min-w-full flex-grow flex-col items-center gap-12 px-4 py-16">
          <h1 className="align-top text-8xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Cognitive Test
          </h1>
          <div className="flex min-w-full flex-grow flex-row items-start justify-center">
            <div
              className={`${
                displayTop ? "mt-0" : "mt-[800px]"
              } flex h-[1938px]`}
            >
              <div
                onClick={() => setDisplayTop((val) => !val)}
                className="flex h-[260px] w-[260px] self-end rounded-3xl border-2 border-green-400 bg-white/10 text-center align-middle text-9xl text-white"
              >
                <p className="m-auto">{displayTop ? "⬇️" : "⬆️"}</p>
              </div>
              <div className="flex w-[1552px] rounded-2xl border-2 border-green-400 bg-white/10 p-[5px]">
                <iframe
                  className=""
                  height={1928}
                  width={1542}
                  src="https://uastaging.reflexion.us/d/drills-minefield"
                ></iframe>
              </div>
              <div className="flex h-[260px] w-[260px] text-6xl"></div>
            </div>
          </div>
          <div className="align-self-end mb-32">
            <Image src="/logoP.png" alt="ai.io logo" width={324} height={140} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
