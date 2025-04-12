import { Version } from '~src/data-modules/version/entities/version.entity';
import { Observable } from 'rxjs';

export abstract class VersionService {
    abstract get(): Observable<Version>;
    abstract error(): Observable<Version>;
}
