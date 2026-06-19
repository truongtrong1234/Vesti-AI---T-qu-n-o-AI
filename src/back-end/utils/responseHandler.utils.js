export const Success = (res, data) => {
  return res.status(200).json(data || { result: 'Thành công' });
};

export const BadRequest = (res, message) => {
  return res.status(400).json({ error: message || 'Yêu cầu không hợp lệ' });
};

export const Unauthorized = (res, message) => {
  return res.status(401).json({ error: message || 'Vui lòng đăng nhập để tiếp tục' });
};

export const Forbidden = (res, message) => {
  return res.status(403).json({ error: message || 'Bạn không có quyền truy cập tài nguyên này' });
};

export const NotFound = (res, message) => {
  return res.status(404).json({ error: message || 'Tài nguyên bạn yêu cầu không tồn tại hoặc đã bị xóa' });
};

export const InternalServerError = (res, message) => {
  return res.status(500).json({ error: message || 'Đã có lỗi xảy ra' });
};
