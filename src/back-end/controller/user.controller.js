import {
  createUserService,
  updateUserService,
  changePasswordService,
  searchUserByNameService,
  listUsersService,
  getUserByIdService
} from "../service/user.service.js";

export async function createUserController(req, res) {
  try {
    const user = await createUserService(req.body);
    return res.status(201).json({ ok: true, data: user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

export async function updateUserController(req, res) {
  try {
    const user_id = Number(req.params.user_id);
    const result = await updateUserService(user_id, req.body);
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

export async function changePasswordController(req, res) {
  try {
    const user_id = Number(req.params.user_id);
    const result = await changePasswordService(user_id, req.body?.new_password);
    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

export async function searchUserByNameController(req, res) {
  try {
    const name = req.query?.name ?? "";
    const limit = req.query?.limit !== undefined ? Number(req.query.limit) : undefined;
    const offset = req.query?.offset !== undefined ? Number(req.query.offset) : undefined;

    const rows = await searchUserByNameService(name, { limit, offset });
    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

export async function listUsersController(req, res) {
  try {
    const filters = {
      user_id: req.query?.user_id,
      email: req.query?.email,
      name: req.query?.name,
      phone_number: req.query?.phone_number,
      age: req.query?.age,
      gender: req.query?.gender,
      job: req.query?.job,
      dateofbirth: req.query?.dateofbirth
    };

    const limit = req.query?.limit !== undefined ? Number(req.query.limit) : undefined;
    const offset = req.query?.offset !== undefined ? Number(req.query.offset) : undefined;

    const rows = await listUsersService(filters, { limit, offset });
    return res.json({ ok: true, data: rows });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}

export async function getUserByIdController(req, res) {
  try {
    const user_id = Number(req.params.user_id);
    const user = await getUserByIdService(user_id);
    return res.json({ ok: true, data: user });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
}