let token = "";

export function setTestCookie(value: string) {
  const match = value.match(/token=([^;]+)/);

  token = match?.[1] ?? "";
}

export function cookies() {
  return Promise.resolve({
    get(name: string) {
      if (name === "token" && token) {
        return {
          value: token,
        };
      }

      return undefined;
    },

    set(name: string, value: string) {
      if (name === "token") {
        token = value;
      }
    },
  });
}
