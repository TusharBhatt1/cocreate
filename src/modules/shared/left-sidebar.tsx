"use client";
import React, { type JSX } from "react";
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { Calendar, Home, Inbox, Pencil, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { LayerType, type Updates } from "~/types";
import { hexToRGB } from "~/utils";
import { IoEllipseOutline, IoSquareOutline } from "react-icons/io5";
import { AiOutlineFontSize } from "react-icons/ai";

const LAYER_CONFIG: Record<LayerType, { icon: JSX.Element; label: string }> = {
  [LayerType.Rectangle]: { icon: <IoSquareOutline />, label: "Rectangle" },
  [LayerType.Ellipse]: { icon: <IoEllipseOutline />, label: "Ellipse" },
  [LayerType.Path]: { icon: <Pencil size={14} />, label: "Drawing" },
  [LayerType.Text]: { icon: <AiOutlineFontSize />, label: "Text" },
};

export default function LeftSidebar() {
  const me = useSelf();
  const others = useOthers();

  const selectedLayer = useSelf((me) => {
    const selections = me.presence.selection;

    return selections.length === 1 ? selections[0] : null;
  });

  const layer = useStorage((root) => {
    if (!selectedLayer) return null;

    return root.layers.get(selectedLayer);
  });

  const roomColor = useStorage((root) => root.roomColor);

  const layers = useStorage((root) => root.layers);
  const layerIds = useStorage((root) => root.layerIds);

  const reverseLayerIds = [...(layerIds ?? [])].reverse();

  const selection = useSelf((me) => me.presence.selection);

  const updateLayer = useMutation(
    ({ storage }, updates: Updates) => {
      if (!selectedLayer) return;

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(selectedLayer);

      if (layer) {
        layer.update({
          ...(updates.x !== undefined && { x: updates.x }),
          ...(updates.y !== undefined && { y: updates.y }),
          ...(updates.height !== undefined && { height: updates.height }),
          ...(updates.width !== undefined && { width: updates.width }),
          ...(updates.fill !== undefined && { fill: hexToRGB(updates.fill) }),
          ...(updates.stroke !== undefined && {
            stroke: hexToRGB(updates.stroke),
          }),
          ...(updates.opacity !== undefined && { opacity: updates.opacity }),
          ...(updates.text !== undefined && { text: updates.text }),
          ...(updates.fontSize !== undefined && { fontSize: updates.fontSize }),
          ...(updates.fontWeight !== undefined && {
            fontWeight: updates.fontWeight,
          }),
          ...(updates.fontFamily !== undefined && {
            fontFamily: updates.fontFamily,
          }),
        });
      }
    },
    [selectedLayer]
  );

  const updateSelected = useMutation(({ setMyPresence }, layerId: string) => {
    setMyPresence({ selection: [layerId] }, { addToHistory: true });
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Layers</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {layerIds &&
                reverseLayerIds.map((id) => {
                  const layer = layers?.get(id);
                  if (!layer) return null;

                  const config = LAYER_CONFIG[layer.type];
                  if (!config) return null;

                  return (
                    <SidebarMenuItem
                      key={id}
                      onClick={() => updateSelected(id)}
                    >
                      <SidebarMenuButton>
                        <div className="flex items-center gap-2">
                          {config.icon}
                          <span>{config.label}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
