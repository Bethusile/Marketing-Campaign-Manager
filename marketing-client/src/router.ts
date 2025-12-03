
export type RouteHandler = () => HTMLElement | Promise<HTMLElement>;

export class Router {
  private routes: Map<string, RouteHandler> = new Map();
  private outlet: HTMLElement;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
    window.addEventListener('popstate', () => this.handleRoute());
    
    document.body.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('download') && link.target !== '_blank') {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
            this.navigate(href);
        }
      }
    });
  }

  addRoute(path: string, handler: RouteHandler) {
    this.routes.set(path, handler);
  }

  navigate(path: string) {
    window.history.pushState({}, '', path);
    this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    let handler = this.routes.get(path);
    if (!handler) {
        if (path !== '/') {
             this.navigate('/');
             return;
        }
    }

    if (handler) {
      this.outlet.innerHTML = '';
      const content = await handler();
      this.outlet.appendChild(content);
    }
  }
  
  init() {
    this.handleRoute();
  }
}
