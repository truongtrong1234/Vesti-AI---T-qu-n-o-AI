// src/back-end/service/package.service.js
import {
  createPackage,
  getPackageById,
  updatePackage,
  deletePackage,
  listPackages,
  countPackages
} from "../database/package.database.js";

function requireUserId(user) {
  const id = user?.id ?? user?.user_id;
  if (!id) throw new Error("UNAUTHORIZED");
  return Number(id);
}

async function assertPackageOwner(package_id, userId) {
  const pkg = await getPackageById(package_id);
  if (!pkg) throw new Error("PACKAGE_NOT_FOUND");
  if (Number(pkg.user_id) !== Number(userId)) throw new Error("FORBIDDEN");
  return pkg;
}

export async function createPackageService(user, payload) {
  const userId = requireUserId(user);
  return await createPackage({ ...payload, user_id: userId });
}

export async function getPackageByIdService(user, package_id) {
  const userId = requireUserId(user);
  return await assertPackageOwner(package_id, userId);
}

export async function updatePackageService(user, package_id, payload) {
  const userId = requireUserId(user);
  await assertPackageOwner(package_id, userId);
  return await updatePackage(package_id, payload);
}

export async function deletePackageService(user, package_id) {
  const userId = requireUserId(user);
  await assertPackageOwner(package_id, userId);
  return await deletePackage(package_id);
}

export async function listPackagesService(user, filters = {}, options = {}) {
  const userId = requireUserId(user);

  const rows = await listPackages({
    filters: { ...filters, user_id: userId },
    limit: options?.limit,
    offset: options?.offset,
    orderBy: options?.orderBy,
    orderDir: options?.orderDir
  });

  if (options?.withTotal) {
    const total = await countPackages({ filters: { ...filters, user_id: userId } });
    return { rows, total, limit: Number(options?.limit ?? 20), offset: Number(options?.offset ?? 0) };
  }

  return rows;
}