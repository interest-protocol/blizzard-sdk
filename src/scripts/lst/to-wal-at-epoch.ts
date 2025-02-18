import { SHARED_OBJECTS } from '../../blizzard/constants';
import { blizzardTestnet } from '../utils.script';

(async () => {
  const wal = await blizzardTestnet.toWalAtEpoch({
    blizzardStaking: SHARED_OBJECTS.testnet.SNOW_STAKING({
      mutable: true,
    }).objectId,
    epoch: 17,
    value: 1_000_000_000n,
  });

  console.log(wal);
})();
