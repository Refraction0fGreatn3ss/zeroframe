export interface TenantScopedStoreHandlers {
  clear: () => void;
  reload?: (tenantId: string) => Promise<void> | void;
}

class TenantRegistry {
  private readonly stores = new Map<string, TenantScopedStoreHandlers>();

  register(name: string, handlers: TenantScopedStoreHandlers): () => void {
    this.stores.set(name, handlers);
    return () => {
      if (this.stores.get(name) === handlers) this.stores.delete(name);
    };
  }

  registeredNames(): string[] {
    return [...this.stores.keys()];
  }

  clearAll(): void {
    for (const [name, handlers] of this.stores) {
      try {
        handlers.clear();
      } catch (err) {
        console.error(`[tenant-registry] Failed clearing ${name}`, err);
      }
    }
  }

  async reloadAll(tenantId: string): Promise<void> {
    const reloads = [...this.stores.values()].map(async (handlers) => handlers.reload?.(tenantId));
    await Promise.allSettled(reloads);
  }
}

export const tenantRegistry = new TenantRegistry();
