import { OWNED_OBJECTS, SHARED_OBJECTS } from '../../blizzard/constants';
import { blizzardSDK, executeTx, wwalAcl } from '../utils.script';

(async () => {
  const { tx, returnValues } = await wwalAcl.signIn({
    admin: OWNED_OBJECTS.WWAL_ADMIN,
  });

  await blizzardSDK.removeNode({
    tx,
    nodeId: '',
    adminWitness: returnValues,
    blizzardStaking: SHARED_OBJECTS.WWAL_STAKING({
      mutable: true,
    }).objectId,
  });

  await executeTx(tx);
})();
