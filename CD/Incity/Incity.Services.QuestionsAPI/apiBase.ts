export class ApiBase {

    private getJwtFromCookie(): string | undefined {
        return document.cookie
            .split('; ')
            .find((x) => x.startsWith('API_TOKEN='))
            ?.split('=')[1];
    }

    protected transformOptions(options: RequestInit): Promise<RequestInit> {
        options.headers = {
            ...options?.headers,
            Authorization: `Bearer ${this.getJwtFromCookie()}`,
        };

        return Promise.resolve(options);
    }
}
