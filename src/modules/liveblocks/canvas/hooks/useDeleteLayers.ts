import { useMutation, useSelf } from "@liveblocks/react";

export default function useDeleteLayers() {
  const selections = useSelf((me) => me.presence.selection);

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");

      const liveLayerIds = storage.get("layerIds");

      for (const id of selections ?? []) {
        liveLayers.delete(id);

        const index = liveLayerIds.indexOf(id);

        if (index !== -1) liveLayerIds.delete(index);
      }

      setMyPresence({ selection: [] }, { addToHistory: true });
    },
    [selections]
  );
}
