import VersionApi from './version.api';

export const VERSION_KEY = 'VERSION' as const;

export default {
  provide: VERSION_KEY,
  useClass: VersionApi
};
