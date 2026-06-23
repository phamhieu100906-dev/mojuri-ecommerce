import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'mojuri_secret_key_for_jwt_auth_987654';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(req) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getAuthUser(req) {
  const decoded = verifyToken(req);
  if (!decoded) {
    throw new Error('Unauthorized');
  }
  return decoded;
}

export function requireAdmin(req) {
  const decoded = getAuthUser(req);
  if (decoded.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }
  return decoded;
}
