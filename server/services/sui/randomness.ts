// import { client } from "./provider";

// export const getOnChainRandom = async (): Promise<number> => {
//   const randomnessResponse = await client.getRandomness();
//   // Convert bytes to number between 0-1
//   const randomNum = parseInt(randomnessResponse.randomness, 16) / 2 ** 256;
//   return randomNum;
// };