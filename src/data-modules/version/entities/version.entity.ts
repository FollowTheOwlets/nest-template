import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity({ name: 'service_version' })
@ObjectType()
export class Version {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    id: number;

    @Column({
        name: 'version',
    })
    @Field({ nullable: false })
    version: string;

    @Column({
        name: 'release_date',
        default: () => 'CURRENT_TIMESTAMP',
    })
    @Field({ nullable: false })
    releaseDate: Date;
}
