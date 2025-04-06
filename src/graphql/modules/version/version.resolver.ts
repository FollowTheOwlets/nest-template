import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Version } from '~src/data-modules/version/entities/version.entity';
import { VersionService } from '~src/data-modules/version/version.service';

@Resolver(() => Version)
export class VersionResolver {
    constructor(private versionService: VersionService) {}

    @Mutation(() => Version)
    async updateVersion(
        @Args('version', { type: () => String }) version: string,
    ) {
        return this.versionService.updateVersion(version);
    }

    @Query(() => Version)
    getLastVersion() {
        return this.versionService.getLastVersion();
    }
}
