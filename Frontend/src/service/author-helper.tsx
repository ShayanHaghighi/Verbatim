import axios from "axios";



export default  async function getAllPlayers(): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      axios({
        method: "GET",
        url: "/api/author",
      })
        .then((response) => {
          resolve(response.data);
        })

    });


}
