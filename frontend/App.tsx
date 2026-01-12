// import { useEffect, useState } from 'react';
// import './App.css';
// import { socket, onSocketConnected, onSocketDisconnected } from './libs/socket';


// function App() {
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   useEffect(() => {
//     const handleConnect = () => setIsConnected(true);
//     const handleDisconnect = () => setIsConnected(false);

//     const removeConnectCallback = onSocketConnected(handleConnect);
//     const removeDisconnectCallback = onSocketDisconnected(handleDisconnect);

//     return () => {
//       removeConnectCallback();
//       removeDisconnectCallback();
//     };
//   }, []);

//   return (
//     <>
//       <h1>{isConnected ? 'Conectado' : 'Não conectado'}</h1>
//     </>
//   );
// }

// export default App;

import Router from "./routes";
import './libs/socket'

export default function App() {
  return (
  <>
    <Router />
  </>
  )
}
