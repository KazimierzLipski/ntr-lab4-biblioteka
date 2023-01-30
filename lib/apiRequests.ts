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

export async function addUser(userdata: any) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userdata),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}

export async function deleteUser(username?: string | null) {
  const response = await fetch("/api/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: username ? username : "" }),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}

export async function getBooks() {
  const response = await fetch("/api/get-books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let json = await response.json();
  if (!response.ok) alert(await response.text());
  return json;
}

export async function getPrivilege(user_id?: string | null) {
  const response = await fetch("/api/get-privilege", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user_id ? { user_id: user_id } : {}),
  });
  let json = await response.text();
  if (!response.ok) alert(await response.text());
  return json;
}

export async function reserve(bookID: number, user_name: string, updated_at: string) {
  const response = await fetch("/api/reserve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ book_id: bookID, user_name: user_name, updated_at }),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}

export async function unreserve(bookID: number) {
  const response = await fetch("/api/unreserve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ book_id: bookID }),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}

export async function lend(bookID: number, user_name: string) {
  const response = await fetch("/api/lend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ book_id: bookID, user_name: user_name }),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}

export async function unlend(bookID: number) {
  const response = await fetch("/api/unlend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ book_id: bookID }),
  });

  if (!response.ok) alert(await response.text());
  return response.ok;
}
