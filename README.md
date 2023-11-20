# Reflexion iFrame Test

This repository has a simple test of placing the [Reflexion
app](https://app.reflexion.us/) within a sized iFrame as we need to be able to
do within our booth experience. It tests the full flow of registering a session
and retrieving the results.

This repo was created using the t3 app for ease of the author (Overkill I know!), but the main code
is in [index.ts](src/pages/index.tsx) and utilises tailwind for styling.

The API Calls to Reflexion are handled by using tRPC and the router of the calls
themselves can be found in [reflexion.ts](src/server//trpc/router/reflexion.ts)
