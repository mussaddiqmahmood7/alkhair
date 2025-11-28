export type BalanceStatus = "proceed" | "no-balance" | "pending"

export interface Client {
  id: string
  clientId: string
  password: string
  name: string
  shopName: string
  phone: string
  address: string
  description: string
  status: BalanceStatus
  createdAt: string
}

const clients: Client[] = [
  {
    id: "1",
    clientId: "ALK001",
    password: "client123",
    name: "Muhammad Ahmed",
    shopName: "Ahmed Electricals",
    phone: "03001234567",
    address: "Main Bazaar, Lahore",
    description: "Regular wholesale customer since 2015",
    status: "proceed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    clientId: "ALK002",
    password: "client456",
    name: "Imran Khan",
    shopName: "Khan Electric Store",
    phone: "03009876543",
    address: "GT Road, Sahiwal",
    description: "Bulk order customer - China boards specialist",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    clientId: "ALK003",
    password: "client789",
    name: "Ali Hassan",
    shopName: "Hassan Brothers",
    phone: "03005551234",
    address: "Railway Road, Multan",
    description: "New customer - started business in 2023",
    status: "no-balance",
    createdAt: new Date().toISOString(),
  },
]

export function getClients(): Client[] {
  return clients
}

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}

export function authenticateClient(clientId: string, password: string): Client | null {
  const client = clients.find((c) => c.clientId === clientId && c.password === password)
  return client || null
}

export function addClient(client: Omit<Client, "id" | "createdAt">): Client {
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  clients.push(newClient)
  return newClient
}

export function updateClient(id: string, updates: Partial<Client>): Client | null {
  const index = clients.findIndex((c) => c.id === id)
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates }
    return clients[index]
  }
  return null
}

export function deleteClient(id: string): boolean {
  const index = clients.findIndex((c) => c.id === id)
  if (index !== -1) {
    clients.splice(index, 1)
    return true
  }
  return false
}
