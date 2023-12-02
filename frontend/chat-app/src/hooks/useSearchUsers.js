export default function useSearchUsers() {
  const SearchUsers = async (setUsers, search) => {
    const obj = JSON.parse(localStorage.getItem("user"));
    let token = null;
    if (obj) {
      token = obj.token;
    }
    if (token) {
      const endPoint = "http://localhost:3000/api/user/search?search=" + search;
      const response = await fetch(endPoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      response
        .json()
        .then((res) => {
          setUsers(res);
        })
        .catch((err) => console.log(err));
    }
  };

  return { SearchUsers };
}
