type ClearHandler = () => void;
type ReloadHandler = (tenantId: string) => Promise<void>;

class TenantRegistry {
  private readonly clearHandlers = new Set<ClearHandler>();
  private readonly reloadHandlers = new Set<ReloadHandler>();

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
    const reloads: Promise<void>[] = [];
    this.reloadHandlers.forEach((handler) => {
      try {
        reloads.push(handler(tenantId));
      } catch (err) {
        console.error('Error initiating tenant store reload', err);
      }
    });
    await Promise.allSettled(reloads);
  }
}

export const tenantRegistry = new TenantRegistry();
