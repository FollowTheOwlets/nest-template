import { DataSource } from 'typeorm';
import { Version } from '../entities/version.entity';

export default {
    provide: 'VERSION_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Version),
    inject: [DataSource],
};
