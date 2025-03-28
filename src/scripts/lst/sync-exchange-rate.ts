import { SHARED_OBJECTS } from '../../blizzard/constants';
import { blizzardSDK, executeTx } from '../utils.script';

(async () => {
  const { tx } = await blizzardSDK.syncExchangeRate({
    blizzardStaking: SHARED_OBJECTS.WWAL_STAKING({
      mutable: true,
    }).objectId,
  });

  await executeTx(tx);
})();
