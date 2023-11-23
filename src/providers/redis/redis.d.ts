declare namespace Redis {
  export type SaveData = {
    key: string;
    value: string;
    expireInSeconds?: number;
  };
}
