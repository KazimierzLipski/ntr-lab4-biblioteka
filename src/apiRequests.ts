async function sendPostReq(data: Object, url: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function pushUserData(
  user: any,
) {
  let toLocalhost;
  if (process.env.NODE_ENV === "production") toLocalhost = false;
  else toLocalhost = true;

  let url = "http://localhost:3000/api/pushUserData";

  const obj = [user];
  return await sendPostReq(obj, url);
}

export async function getUserData(
  pid: string
): Promise<{ data: any; isExpired: boolean }> {
  let toLocalhost;
  if (process.env.NODE_ENV === "production") toLocalhost = false;
  else toLocalhost = true;

  let url = `http://localhost:3000/api/getUserData?pid=${pid}`;

  const response = await fetch(url);

  let isExpired = false;
  let data = [];

  if (response.status === 410) isExpired = true;
  else data = JSON.parse(await response.json());

  return { data: data, isExpired };
}