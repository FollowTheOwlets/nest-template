import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'service_version' })
export class Version {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'version',
    })
    version: string;

    @Column({
        name: 'release_date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    release_date: Date;
}
