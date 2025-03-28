import { SHARED_OBJECTS } from '../../blizzard/constants';
import { blizzardSDK } from '../utils.script';

(async () => {
  const lst = await blizzardSDK.toLstAtEpoch({
    blizzardStaking: SHARED_OBJECTS.WWAL_STAKING({
      mutable: true,
    }).objectId,
    epoch: 1,
    value: 1_000_000_000n,
  });

  console.log(lst);
})();
