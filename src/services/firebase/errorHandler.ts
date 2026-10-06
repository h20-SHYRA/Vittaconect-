import { auth } from '../../firebase/config';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Standardized Firestore error handler required by Firebase security diagnostics
 * and centralized error resilience (Section 30).
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  options: { rethrow?: boolean } = { rethrow: false }
): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
      emailVerified: auth.currentUser?.emailVerified ?? null,
      isAnonymous: auth.currentUser?.isAnonymous ?? null,
      tenantId: auth.currentUser?.tenantId ?? null,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  if (options.rethrow) {
    throw new Error(JSON.stringify(errInfo));
  }
  return errInfo;
}

/**
 * Translates technical errors into warm, human-friendly Brazilian Portuguese
 * messages without exposing stack traces or sensitive paths.
 */
export function getHumanFriendlyErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (raw.includes('offline') || raw.includes('network') || raw.includes('failed to fetch')) {
    return 'Sem conexão no momento. Seus dados locais continuam seguros e serão sincronizados assim que a internet voltar.';
  }
  if (raw.includes('permission') || raw.includes('insufficient')) {
    return 'Você não tem permissão para acessar este recurso ou sua sessão precisa ser renovada.';
  }
  if (raw.includes('quota')) {
    return 'O limite diário de sincronização em nuvem foi atingido. O aplicativo está operando normalmente em modo local seguro.';
  }
  if (raw.includes('expired') || raw.includes('auth/')) {
    return 'Sua sessão expirou por segurança. Faça login novamente para continuar.';
  }
  if (raw.includes('timeout') || raw.includes('deadline')) {
    return 'A conexão demorou mais que o esperado. Tente novamente em instantes.';
  }
  return 'Não foi possível concluir esta ação agora. Tente novamente em alguns segundos.';
}
