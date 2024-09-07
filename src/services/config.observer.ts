import { Observable, Subject } from "rxjs";

type ConfigEnv = 'dev' | 'main' | 'test';

class ConfigObserver {
    private _env: ConfigEnv = 'dev';
    private env$ = new Subject<string>();

    public changeEnv(env: ConfigEnv) {
        this._env = env;
        this.env$.next(env);
    }

    public get currentEnv(): string {
        return this._env;
    }

    onEnvChange(): Observable<string> {
        return this.env$.asObservable();
    }
}

export const configObserver = new ConfigObserver();