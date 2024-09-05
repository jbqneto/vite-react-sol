import { Observable, Subject } from "rxjs";


class LoadObserver {
    private _loading = false;
    private load$ = new Subject<boolean>();

    public constructor() {
        this.observe().subscribe((_is) => this._loading = _is);
    }

    public startLoading() {
        if (!this.isLoading()) {
            this.load$.next(true);
        }
    }

    public stopLoading() {
        if (this.isLoading()) {
            this.load$.next(false);
        }
    }

    public isLoading(): boolean {
        return this._loading;
    }

    public observe(): Observable<boolean> {
        return this.load$.asObservable();
    }
}

export const loadObserver = new LoadObserver();