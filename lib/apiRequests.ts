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

  let url = "http://localhost:3000/api/push-user-data";

  const obj = [user];
  return await sendPostReq(obj, url);
}

export async function getUserData(
  pid: string
){
  let toLocalhost;
  if (process.env.NODE_ENV === "production") toLocalhost = false;
  else toLocalhost = true;

  let url = `http://localhost:3000/api/get-user-data`;
  console.log(pid)
  let obj = {id: pid}

  return await sendPostReq(obj, url);
}