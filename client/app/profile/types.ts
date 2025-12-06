export interface ProfileMintParams {
  firstName: string;
  email: string;
  birthday: {
    month: number;
    day: number;
    year: number;
  };
  gender: string;
  showGender: boolean;
  interestedIn: string;
  relationshipIntent: string[];
  interests: string[];
}
