import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

// En développement uniquement : une valeur par défaut évite d'avoir à
// configurer quoi que ce soit pour démarrer. En production, définissez
// impérativement JWT_SECRET dans les variables d'environnement.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-a-changer-en-production';
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.warn('⚠️ JWT_SECRET non défini — à faire impérativement avant un déploiement réel.');
}

export const ROLES = [
  'ADMIN',
  'QUALITY_MANAGER',
  'DIRECTION',
  'PROCESS_OWNER',
  'AUDITOR',
  'COLLABORATOR',
  'READER',
] as const;
export type RoleType = (typeof ROLES)[number];

export interface TokenPayload {
  userId: string;
  companyId: string;
  role: string;
  email: string;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extrait et vérifie l'utilisateur à partir de l'en-tête Authorization.
 * companyId vient TOUJOURS de ce token, jamais du body envoyé par le
 * client — c'est ce qui garantit l'isolation multi-tenant côté serveur.
 */
export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const header = req.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return verifyToken(header.slice(7));
}

export function requireRole(user: TokenPayload, allowed: RoleType[]): boolean {
  if (user.role === 'ADMIN') return true; // l'ADMIN a toujours accès complet
  return allowed.includes(user.role as RoleType);
}
