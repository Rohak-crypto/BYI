

window.BYI_API = {
    tokenKey: "byi_token",
    userKey: "loggedInUser",

    async request(path, options = {}) {
        const headers = { ...(options.headers || {}) };

        let body = options.body;

        if (body && typeof body !== "string") {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(body);
        }

        const token = localStorage.getItem(this.tokenKey);

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(path, {
            ...options,
            headers,
            body
        });

        let data = {};

        try {
            data = await response.json();
        } catch {
            data = {};
        }

        if (response.status === 401) {
            this.clearSession();

            if (!window.location.pathname.includes("/auth/login.html")) {
                window.location.href = "/pages/auth/login.html";
            }

            throw new Error("Your session expired. Please log in again.");
        }

        if (!response.ok) {
            throw new Error(
                data.message || `Request failed (${response.status})`
            );
        }

        return data;
    },

    isLoggedIn() {
        return Boolean(localStorage.getItem(this.tokenKey));
    },

    saveSession(data) {
        if (!data || !data.token || !data.user) {
            throw new Error("Invalid login response.");
        }

        localStorage.setItem(this.tokenKey, data.token);
        localStorage.setItem(this.userKey, JSON.stringify(data.user));
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem(this.userKey));
        } catch {
            return null;
        }
    },

    clearSession() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }
};
