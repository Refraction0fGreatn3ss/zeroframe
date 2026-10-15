import { useState } from 'react';
import type { LivingEntity } from '../../../types';
import type { AssetDrawerTab } from '../assets.types';

export const useAssetDrawer = () => {
  const [activeEntity, setActiveEntity] = useState<LivingEntity | null>(null);
  const [drawerTab, setDrawerTab] = useState<AssetDrawerTab>('CONTEXT');

  const openDrawer = (entity: LivingEntity) => {
    setActiveEntity(entity);
    setDrawerTab('CONTEXT');
  };

  const closeDrawer = () => setActiveEntity(null);

  return { activeEntity, drawerTab, setDrawerTab, openDrawer, closeDrawer };
};
