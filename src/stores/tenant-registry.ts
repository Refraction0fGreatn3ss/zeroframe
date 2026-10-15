/**
 * ZeroFrame Multi-Store Tenant Isolation Registry
 * Coordinates synchronous clearing and reloading of tenant state across all modules.
 */

type ClearHandler = () => void;
type ReloadHandler = (tenantId: string) => Promise<void>;

class TenantRegistry {
  private clearHandlers: Set<ClearHandler> = new Set();
  private reloadHandlers: Set<ReloadHandler> = new Set();

  public register(clear: ClearHandler, reload: ReloadHandler) {
    this.clearHandlers.add(clear);
    this.reloadHandlers.add(reload);
    return () => {
      this.clearHandlers.delete(clear);
      this.reloadHandlers.delete(reload);
    };
  }

  public clearAll() {
    this.clearHandlers.forEach((handler) => {
      try {
        handler();
      } catch (err) {
        console.error('Error clearing tenant store state', err);
      }
    });
  }

  public async reloadAll(tenantId: string) {
    const promises: Promise<void>[] = [];
    this.reloadHandlers.forEach((handler) => {
      try {
        promises.push(handler(tenantId));
      } catch (err) {
        console.error('Error initiating tenant store reload', err);
      }
    });
    await Promise.allSettled(promises);
  }
}

export const tenantRegistry = new TenantRegistry();
