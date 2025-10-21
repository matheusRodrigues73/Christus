import useSWR from "swr";

async function fetchAPI(key){
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody
}

export default function StatusPage(){
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt/>
      <Dependencies/>
    </>
  )
}

function UpdatedAt(){
  const {isLoading, data} = useSWR("/api/v1/status", fetchAPI, {refreshInterval: 2000})
  let updatedAtResponse = "Carregando..."
  if(!isLoading && data){
    updatedAtResponse = new Date(data.updated_at).toLocaleString("pt-BR")
  }
  return "Última atualização às: " + updatedAtResponse
}

function Dependencies(){
  const {isLoading, data} = useSWR("/api/v1/status", fetchAPI, {refreshInterval: 2000})
  let versionResponse = "Carregando..."
  let maxConnectionsResponse = "Carregando..."
  let openedConnectionsResponse = "Carregando..."
  if(!isLoading && data){
    versionResponse = data.dependencies.database.version
    maxConnectionsResponse = data.dependencies.database.max_connections
    openedConnectionsResponse = data.dependencies.database.opened_connections
  }
  return (
    <>
      <h2>dependencias:</h2>
      <h3>Banco de dados:</h3>
      <ul>
        <li>Verção atual: {versionResponse}</li>
        <li>Maxímo de conexões suportadas: {maxConnectionsResponse}</li>
        <li>Conexões ativas: {openedConnectionsResponse}</li>
      </ul>     
    </>
  )
}