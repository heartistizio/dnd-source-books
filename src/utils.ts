export const convertDbToJsonArray = (dbBlob: string) => dbBlob.split('\n');

export const convertJsonArrayToDb = <T>(jsonArrayString: T[]) =>
  jsonArrayString.map((json) => JSON.stringify(json)).join('\n');
