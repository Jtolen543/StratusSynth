import { adminCloudClient } from "@/clients/firebase"

// displayName should start with a letter and only consist of letters, digits and hyphens with 4-20 characters.
export async function createTenant(displayName: string) {
  const manager = adminCloudClient.auth().tenantManager()
  const tenant = await manager.createTenant({
    displayName
  })
  return tenant
}

export async function getTenant(tenantId: string) {
  const manager = adminCloudClient.auth().tenantManager()
  const tenant = await manager.getTenant(tenantId)
  return tenant
}

export async function deleteTenant(tenantId: string) {
  const manager = adminCloudClient.auth().tenantManager()
  await manager.deleteTenant(tenantId)
}

export async function updateTenant(tenantId: string) {
  const manager = adminCloudClient.auth().tenantManager()
  const tenant = await manager.updateTenant(tenantId, {

  })
  return tenant
}
