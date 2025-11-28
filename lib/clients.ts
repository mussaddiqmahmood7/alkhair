import { readBlobData, writeBlobData, seedBlobData } from "./blob-storage";

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

const CLIENTS_BLOB_PATH = "data/clients.json";

const defaultClients: Client[] = [
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

export async function getClients(): Promise<Client[]> {
  try {
    // Try to get clients from blob storage
    const clients = await readBlobData<Client[]>(CLIENTS_BLOB_PATH, []);
    return clients;
  } catch (error) {
    // If no data exists, seed default data to blob storage
    console.log("No clients found in blob storage, seeding default data...");
    return await seedBlobData(CLIENTS_BLOB_PATH, defaultClients);
  }
}

export async function getClientById(id: string): Promise<Client | undefined> {
  const clients = await getClients();
  return clients.find((c) => c.id === id);
}

export async function authenticateClient(clientId: string, password: string): Promise<Client | null> {
  const clients = await getClients();
  const client = clients.find((c) => c.clientId === clientId && c.password === password);
  return client || null;
}

export async function addClient(client: Omit<Client, "id" | "createdAt">): Promise<Client> {
  const clients = await getClients();
  const newClient: Client = {
    ...client,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  await writeBlobData(CLIENTS_BLOB_PATH, clients);
  return newClient;
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
  const clients = await getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates };
    await writeBlobData(CLIENTS_BLOB_PATH, clients);
    return clients[index];
  }
  return null;
}

export async function deleteClient(id: string): Promise<boolean> {
  const clients = await getClients();
  const index = clients.findIndex((c) => c.id === id);
  if (index !== -1) {
    clients.splice(index, 1);
    await writeBlobData(CLIENTS_BLOB_PATH, clients);
    return true;
  }
  return false;
}
