import { string, z } from "zod";
import { Axios } from "axios";

import { router, publicProcedure } from "../trpc";
import { env } from "../../../env/server.mjs";
import { randUser, randPastDate } from "@ngneat/falso";
import { DateTime } from "luxon";

const relfexionApi = new Axios({
  baseURL: env.REFLEXION_BASE_URL,
  headers: {
    Authorization: `Bearer ${env.REFLEXION_API_KEY}`,
  },
});

type UserSessionResponse = {
  userSessionToken: string;
};

type userSessionTokenCheckResponse =
  | {
      completed: false;
    }
  | {
      completed: true;
      assessmentType: string;
      completedTime: number;
      cognitions: {
        name: "prioritization";
        rawScore: number;
        rawUnits: string;
        rfxnScore: number;
      }[];
    };

export const exampleRouter = router({
  createNewRandomReflexionSession: publicProcedure.mutation(async ({}) => {
    const randomUser = randUser();
    const birthDate = randPastDate();

    const userSessionResponse = await relfexionApi.post<UserSessionResponse>(
      "/org/usersession",
      {
        userID: randomUser.id,
        birthDate: DateTime.fromJSDate(birthDate).toFormat("yyyy-MM-dd"),
        assessmentType: "ai.io_aws",
        showVideos: false,
        showProgressPage: false,
        showSpiderGraph: false,
        surveyResponses: {},
      }
    );

    return {
      userId: randomUser.id,
      birthDate: birthDate,
      userSessionToken: userSessionResponse.data.userSessionToken,
    };
  }),
  checkUserSession: publicProcedure
    .input(z.object({ userSessionToken: z.string() }))
    .query(async ({ input }) => {
      const userSessionTokenCheckResponse =
        await relfexionApi.get<userSessionTokenCheckResponse>(
          `/org/usersession/${input.userSessionToken}`
        );

      return userSessionTokenCheckResponse.data;
    }),
});
