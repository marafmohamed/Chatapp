export default function useMessage() {
  const sendMessage = async (message) => {
    const {content,chatId}=message;
    const obj = JSON.parse(localStorage.getItem("user"));
    let token = null;
    if (obj) {
      token = obj.token;
    }
    try {
      const results = await fetch(
        "http://localhost:3000/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({content , chatId}),
        }
      );
      const res = await results.json();
      
      return res;
    } catch (err) {
      console.log(err);
    }
  };
  return {sendMessage};
}
