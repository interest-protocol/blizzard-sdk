import { SHARED_OBJECTS } from '../../blizzard/constants';
import { blizzardSDK } from '../utils.script';

(async () => {
  const fees = await blizzardSDK.getFees(
    SHARED_OBJECTS.WWAL_STAKING({ mutable: false }).objectId
  );

  console.log(fees);
})();
