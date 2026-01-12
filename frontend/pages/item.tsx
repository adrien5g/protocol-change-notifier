import { useParams } from "react-router-dom";
import { useEffect } from "react";
import client from "../libs/http";
import { joinProtocol, leaveProtocol, onProtocolUpdated, disconnectSocket } from "../libs/socket";
import UsersCount from "../components/usersCount";

export default function Item() {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    joinProtocol(id);

    const unsubscribe = onProtocolUpdated((data) => {
      if (data.protocol_id === Number(id)) {
        alert(`O protocolo ${id} foi atualizado! Por favor, atualize a página.`);
        disconnectSocket();
      }
    });

    return () => {
      leaveProtocol(id);
      unsubscribe();
    };
  }, [id]);

  async function updateProcess() {
    await client.post(`/protocol/${id}`)
  }

  return (
    <div className="flex flex-col space-y-2">
      <p>ID: {id}</p>
      <button onClick={updateProcess}>Update</button>
      <UsersCount />
    </div>
  );
}
