import { isNull } from "../../utils/Utility.js";

export let entityNames: Record<string, string | null> | null = null;

export const setEntityNames = (newEntityNames: Record<string, string | null> | null) => {
    entityNames = newEntityNames;
};

export const findCollectionName = (entityName: string): string | null => {
    if (isNull(entityNames)) return null;

    const collectionName = entityNames[entityName];
    if (!collectionName) {
        for (const key in entityNames) {
            if (entityNames[key] === entityName) {
                return entityName;
            }
        }
    }

    return collectionName;
};