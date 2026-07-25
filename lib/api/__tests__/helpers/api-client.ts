import { setTestCookie } from "../mocks/next-headers";

type RouteContext<T extends Record<string, string> = Record<string, string>> = {
  params: Promise<T>;
};
type RouteHandler<T extends Record<string, string> = Record<string, string>> = (
  request: Request,
  context: RouteContext<T>,
) => Promise<Response>;

export class ApiClient {
  private cookies = "";

  setCookie(cookie: string) {
    this.cookies = cookie;

    setTestCookie(cookie);
  }

  getCookies() {
    return this.cookies;
  }

  setCookies(response: Response) {
    const cookie = response.headers.get("set-cookie");

    if (cookie) {
      this.setCookie(cookie);
    }
  }

  async request<T extends Record<string, string> = Record<string, string>>(
    handler: RouteHandler<T>,
    options?: {
      method?: string;
      body?: string;
      params?: T;
    },
  ): Promise<Response> {
    const request = new Request("http://localhost", {
      method: options?.method ?? "GET",

      headers: {
        "content-type": "application/json",

        ...(this.cookies
          ? {
              cookie: this.cookies,
            }
          : {}),
      },

      body: options?.body,
    });

    return handler(request, {
      params: Promise.resolve((options?.params ?? {}) as T),
    });
  }
}
