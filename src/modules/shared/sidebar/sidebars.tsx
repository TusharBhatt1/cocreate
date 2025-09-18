"use client";
import React, { useEffect, type JSX } from "react";
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { Calendar, Home, Inbox, Pencil, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import { LayerType, type Color, type Updates } from "~/types";
import { colorToCss, connectionIdToColor, hexToRGB } from "~/utils";
import { IoEllipseOutline, IoSquareOutline } from "react-icons/io5";
import { AiOutlineFontSize } from "react-icons/ai";
import NumberInput from "./number-input";
import { BiSolidCircleHalf } from "react-icons/bi";
import { RiRoundedCorner } from "react-icons/ri";
import ColorPicker from "./color-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { FONTS, FONT_WEIGHTS } from "~/constants";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { cn } from "~/lib/utils";
import type { User } from "@prisma/client";
import ShareRoom from "./share-room";

const LAYER_CONFIG: Record<LayerType, { icon: JSX.Element; label: string }> = {
  [LayerType.Rectangle]: { icon: <IoSquareOutline />, label: "Rectangle" },
  [LayerType.Ellipse]: { icon: <IoEllipseOutline />, label: "Ellipse" },
  [LayerType.Path]: { icon: <Pencil size={14} />, label: "Drawing" },
  [LayerType.Text]: { icon: <AiOutlineFontSize />, label: "Text" },
};

export default function Sidebars({
  roomId,
  roomName,
  otherWithAccessToRoom,
}: {
  roomId:string;
  roomName: string;
  otherWithAccessToRoom: User[];
}) {
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

  const setRoomColor = useMutation(({ storage }, newColor: Color) => {
    if (newColor) {
      storage.set("roomColor", newColor);
    }
  }, []);
  return (
    <>
      <Sidebar>
        <SidebarHeader>{roomName}</SidebarHeader>
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

      {/* Right */}
      <Sidebar side="right">
        <SidebarHeader className="flex flex-row gap-2 flex-wrap justify-between">
          <div className="flex flex-row gap-2">
          {me && (
            <Avatar>
              <AvatarImage alt={me.info?.name || "User avatar"} />
              <AvatarFallback
                className="size-8 text-neutral-100 flex items-center justify-center"
                style={{
                  backgroundColor: connectionIdToColor(me.connectionId),
                }}
              >
                {" "}
                {me.info?.name
                  ? me.info.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          )}

          {others?.map((user) => (
            <Avatar key={user.id}>
              <AvatarImage alt={user.info?.name || "User avatar"} />
              <AvatarFallback
                className="size-8 text-neutral-100 flex items-center justify-center"
                style={{
                  backgroundColor: connectionIdToColor(user.connectionId),
                }}
              >
                {user.info?.name
                  ? user.info.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
          ))}
          </div>
          <div>
            <ShareRoom roomId={roomId} otherWithAccessToRoom={otherWithAccessToRoom}/>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {layer ? (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  {/* Positions */}
                  <SidebarMenuItem>
                    <span className="text-xs font-medium text-gray-500">
                      Positions
                    </span>
                    <div className="flex gap-1 ">
                      <NumberInput
                        value={layer.x}
                        onChange={(number) => updateLayer({ x: number })}
                        className="w-1/2"
                        icon={<p>X</p>}
                      />
                      <NumberInput
                        value={layer.y}
                        onChange={(number) => updateLayer({ y: number })}
                        className="w-1/2"
                        icon={<p>Y</p>}
                      />
                    </div>
                  </SidebarMenuItem>

                  {/* Dimensions */}
                  {layer.type !== LayerType.Path && (
                    <SidebarMenuItem>
                      <span className="text-xs font-medium text-gray-500">
                        Dimensions
                      </span>
                      <div className="flex gap-1">
                        <NumberInput
                          value={layer.height}
                          onChange={(number) => updateLayer({ height: number })}
                          className="w-1/2"
                          icon={<p>H</p>}
                        />
                        <NumberInput
                          value={layer.width}
                          onChange={(number) => updateLayer({ width: number })}
                          className="w-1/2"
                          icon={<p>W</p>}
                        />
                      </div>
                    </SidebarMenuItem>
                  )}

                  {/* Opacity */}
                  <div className="flex gap-1">
                    <SidebarMenuItem className="w-full">
                      <span className="text-xs font-medium text-gray-500">
                        Opacity
                      </span>
                      <NumberInput
                        value={layer.opacity}
                        onChange={(number) => updateLayer({ opacity: number })}
                        className="w-full"
                        icon={<BiSolidCircleHalf />}
                        max={100}
                        min={0}
                      />
                    </SidebarMenuItem>

                    {/* Corner Radius */}
                    {layer.type === LayerType.Rectangle && (
                      <SidebarMenuItem className="w-full">
                        <span className="text-xs font-medium text-gray-500">
                          Corner Radius
                        </span>
                        <NumberInput
                          value={layer.cornerRadius ?? 0}
                          onChange={(number) =>
                            updateLayer({ cornerRadius: number })
                          }
                          className="w-full"
                          icon={<RiRoundedCorner />}
                          max={100}
                          min={0}
                        />
                      </SidebarMenuItem>
                    )}
                  </div>

                  <SidebarMenuItem className="w-full">
                    <span className="text-xs font-medium text-gray-500">
                      Fill
                    </span>
                    <ColorPicker
                      value={colorToCss(layer.fill)}
                      onChange={(color) =>
                        updateLayer({ fill: color, stroke: color })
                      }
                      className="w-full"
                    />
                  </SidebarMenuItem>

                  <SidebarMenuItem className="w-full">
                    <span className="text-xs font-medium text-gray-500">
                      Stroke
                    </span>
                    <ColorPicker
                      value={colorToCss(layer.stroke)}
                      onChange={(color) => updateLayer({ stroke: color })}
                      className="w-full"
                    />
                  </SidebarMenuItem>

                  {layer.type === LayerType.Text && (
                    <>
                      <SidebarMenuItem className="w-full">
                        <span className="text-xs font-medium text-gray-500 mb-2">
                          Typography
                        </span>
                        <Select
                          value={layer.fontFamily}
                          onValueChange={(fontFamily) =>
                            updateLayer({ fontFamily })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select font family" />
                          </SelectTrigger>
                          <SelectContent>
                            {FONTS.map((font) => (
                              <SelectItem key={font} value={font}>
                                {font}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SidebarMenuItem>

                      <SidebarMenuItem className="w-full">
                        <span className="text-xs font-medium text-gray-500 mb-2">
                          Size
                        </span>
                        <NumberInput
                          value={layer.fontSize ?? 1}
                          onChange={(number) =>
                            updateLayer({ fontSize: number })
                          }
                          className="w-full"
                          icon={<p>S</p>}
                          max={100}
                          min={0}
                        />
                      </SidebarMenuItem>

                      <SidebarMenuItem className="w-full">
                        <span className="text-xs font-medium text-gray-500 mb-2">
                          Font weight
                        </span>
                        <Select
                          value={layer.fontWeight.toString()}
                          onValueChange={(fontWeight) =>
                            updateLayer({ fontWeight: Number(fontWeight) })
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select font weight" />
                          </SelectTrigger>
                          <SelectContent>
                            {FONT_WEIGHTS.map((w) => (
                              <SelectItem key={w} value={w}>
                                {w}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-3">
                  <SidebarMenuItem className="w-full">
                    <span className="text-xs font-medium text-gray-500">
                      Page
                    </span>
                    <ColorPicker
                      value={colorToCss(roomColor ?? null)}
                      onChange={(color) => setRoomColor(hexToRGB(color))}
                      className="w-full"
                    />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>
    </>
  );
}
