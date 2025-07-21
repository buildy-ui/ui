import * as React from "react"
import { cn } from "@ui8kit/core";

function Img({ className, ...props }: React.ComponentProps<"img">) {
  return (
    <img
      data-class="img"
      className={cn(className)}
      {...props}
    />
  )
}

Img.displayName = "Img"

function Video({ className, ...props }: React.ComponentProps<"video">) {
  return (
    <video
      data-class="video"
      className={cn(className)}
      {...props}
    />
  )
}

Video.displayName = "Video"

function Audio({ className, ...props }: React.ComponentProps<"audio">) {
  return (
    <audio
      data-class="audio"
      className={cn(className)}
      {...props}
    />
  )
}

Audio.displayName = "Audio"

function Picture({ className, ...props }: React.ComponentProps<"picture">) {
  return (
    <picture
      data-class="picture"
      className={cn(className)}
      {...props}
    />
  )
}

Picture.displayName = "Picture"

function Source({ className, ...props }: React.ComponentProps<"source">) {
  return (
    <source
      data-class="source"
      className={cn(className)}
      {...props}
    />
  )
}

Source.displayName = "Source"

function Iframe({ className, ...props }: React.ComponentProps<"iframe">) {
  return (
    <iframe
      data-class="iframe"
      className={cn(className)}
      {...props}
    />
  )
}

Iframe.displayName = "Iframe"

function Map({ className, ...props }: React.ComponentProps<"map">) {
  return (
    <map
      data-class="map"
      className={cn(className)}
      {...props}
    />
  )
}

Map.displayName = "Map"

function Area({ className, ...props }: React.ComponentProps<"area">) {
  return (
    <area
      data-class="area"
      className={cn(className)}
      {...props}
    />
  )
}

Area.displayName = "Area"

function Object({ className, ...props }: React.ComponentProps<"object">) {
  return (
    <object
      data-class="object"
      className={cn(className)}
      {...props}
    />
  )
}

Object.displayName = "Object"

function Svg({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-class="svg"
      className={cn(className)}
      {...props}
    />
  )
}

Svg.displayName = "Svg"

function Canvas({ className, ...props }: React.ComponentProps<"canvas">) {
  return (
    <canvas
      data-class="canvas"
      className={cn(className)}
      {...props}
    />
  )
}

Canvas.displayName = "Canvas"

export { Img, Video, Audio, Picture, Source, Iframe, Map, Area, Object, Svg, Canvas }