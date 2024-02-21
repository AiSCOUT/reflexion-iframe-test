import { type NextPage } from "next";
import Head from "next/head";

import type { RouterOutputs } from "../utils/trpc";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { useEffect, useState } from "react";
import { env } from "../env/client.mjs";

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
  useDisablePinchZoomEffect();
  const [displayTop, setDisplayTop] = useState(true);

  const getNewReflexionSession =
    trpc.reflexion.createNewRandomSession.useMutation();

  const [reflexionUserSession, setUserSession] = useState<
    RouterOutputs["reflexion"]["createNewRandomSession"] | null
  >(null);

  const [reflexionResultObtained, setReflexionResultObtained] =
    useState<boolean>(false);

  // Call on page load to get a new user session with reflexion
  useEffect(() => {
    getNewReflexionSession.mutateAsync().then((res) => {
      setUserSession(res);
    });
    // This is actually only needed to be reset here due to hot reload keeping
    // react state alive... Refreshing the page for real clears the state, but
    // if you are resetting / running a new test elsewhere, you will need to reset it there.
    setReflexionResultObtained(false);
  }, []);

  // Check the user session to see if the test is complete
  const sessionResultQuery = trpc.reflexion.checkUserSession.useQuery(
    {
      userSessionToken: reflexionUserSession?.userSessionToken || "",
    },
    {
      // Every 2 seconds
      refetchInterval: 2000,
      // But only when the user session is available and the result has not been obtained
      enabled:
        !!reflexionUserSession?.userSessionToken && !reflexionResultObtained,
      // record in state when we get a successful result.
      onSuccess: (data) => {
        if (data.completed) {
          setReflexionResultObtained(true);
        }
      },
    }
  );

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
            {sessionResultQuery.data?.completed ? (
              <div className="mt-[300px] flex w-[800px] flex-col rounded-3xl border-2 border-green-400 bg-white/10 p-8 text-center align-middle text-6xl text-white">
                <p className="m-auto flex">✅</p>
                <br />
                <p className="m-auto w-[500px]">
                  Test complete - Refresh to try again
                </p>
              </div>
            ) : (
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
                  {reflexionUserSession &&
                    reflexionUserSession.userSessionToken && (
                      <iframe
                        className=""
                        height={1928}
                        width={1542}
                        src={`${env.NEXT_PUBLIC_REFLEXION_IFRAME_BASE_URL}?omitMobileCheck=true&userSession=${reflexionUserSession?.userSessionToken}`}
                      ></iframe>
                    )}
                </div>
                <div className="flex h-[260px] w-[260px] text-6xl"></div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col text-3xl text-white">
              <div className="flex text-5xl font-bold text-white">
                User Session:
              </div>
              <pre>{JSON.stringify(reflexionUserSession, null, 2)}</pre>
            </div>
            <div className="flex flex-col  text-3xl text-white">
              <div className="flex text-5xl font-bold text-white">
                Test Result:
              </div>
              <pre>{JSON.stringify(sessionResultQuery.data, null, 2)}</pre>
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
