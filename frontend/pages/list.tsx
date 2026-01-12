import { Link } from "react-router-dom";
import UsersCount from "../components/usersCount";
import client from "../libs/http";
import { useEffect, useState } from "react";

export default function ListItems() {
  const [data, setData] = useState<string[]>([]);

  async function fetchData() {
    const response = await client.get("/protocols");
    setData(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="grid grid-cols-8 gap-4 p-4">
        {data.map((e) => (
          <Link key={e} to={`/item/${e}`}>
            <div className="p-4 border rounded text-center hover:bg-gray-100">
              <p>{e}</p>
            </div>
          </Link>
        ))}
      </div>
      <UsersCount />
    </div>
  );
}
