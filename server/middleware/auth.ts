import { TRPCError } from "@trpc/server";

/**
 * Contexto do usuário autenticado
 */
export interface AuthContext {
  userId: number;
  empresaId: number;
  role: string;
  email: string;
}

/**
 * Mock de autenticação para desenvolvimento
 * TODO: Implementar autenticação real com JWT/OAuth
 */
export function getAuthContext(): AuthContext {
  // Por enquanto, retorna usuário demo da empresa 1
  return {
    userId: 2, // Demo User
    empresaId: 1, // NEX1 Proteção Veicular - Demo
    role: "gestor",
    email: "demo@pv.ai",
  };
}

/**
 * Verifica se o usuário tem permissão para acessar um recurso
 */
export function checkPermission(userRole: string, requiredRoles: string[]): boolean {
  const roleHierarchy: Record<string, number> = {
    super_admin: 6,
    admin: 5,
    gestor: 4,
    analista: 3,
    operador: 2,
    visualizador: 1,
  };

  const userLevel = roleHierarchy[userRole] || 0;
  const requiredLevel = Math.min(...requiredRoles.map((r) => roleHierarchy[r] || 0));

  return userLevel >= requiredLevel;
}

/**
 * Middleware para proteger rotas que requerem autenticação
 */
export function requireAuth(ctx: any) {
  const auth = getAuthContext();
  
  if (!auth || !auth.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar autenticado para acessar este recurso",
    });
  }

  return { ...ctx, auth };
}

/**
 * Middleware para proteger rotas que requerem roles específicas
 */
export function requireRole(requiredRoles: string[]) {
  return (ctx: any) => {
    const authCtx = requireAuth(ctx);
    
    if (!checkPermission(authCtx.auth.role, requiredRoles)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Você não tem permissão para acessar este recurso",
      });
    }

    return authCtx;
  };
}
