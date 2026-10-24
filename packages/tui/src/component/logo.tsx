import { createMemo, createSignal, For, onCleanup } from "solid-js"
import { NativeImage, RGBA } from "@opentui/core"
import { useRenderer, useTerminalDimensions } from "@opentui/solid"
import { CapriConfig } from "../capri-config"
import { logo, palette, type LogoArt } from "../logo"
import { halfblockLogo, halfblockPalette } from "../logo-halfblock"
import { useTheme } from "../context/theme"
import { logoImage, logoImageSize } from "../logo-image"

const quadrantColors = palette.map((hex) => RGBA.fromHex(hex))
const halfblockColors = halfblockPalette.map((hex) => RGBA.fromHex(hex))

function Art(props: { art: LogoArt; colors: readonly RGBA[] }) {
  return (
    <For each={props.art}>
      {(row) => (
        <box flexDirection="row">
          <For each={row}>
            {([text, fg, bg]) => (
              <text
                fg={fg === null ? undefined : props.colors[fg]}
                bg={bg === null ? undefined : props.colors[bg]}
                selectable={false}
              >
                {text}
              </text>
            )}
          </For>
        </box>
      )}
    </For>
  )
}

export function Logo() {
  const dimensions = useTerminalDimensions()
  const renderer = useRenderer()
  const theme = useTheme()
  const supported = () => {
    const capabilities = renderer.capabilities
    return Boolean(capabilities?.kitty_graphics || capabilities?.sixel)
  }
  // Terminal capability replies arrive after startup, so re-check when they land.
  const [inline, setInline] = createSignal(supported())
  const update = () => setInline(supported())
  renderer.on("capabilities", update)
  onCleanup(() => renderer.off("capabilities", update))

  // Sixel has no alpha channel, so flatten the logo onto the theme background instead of relying on transparency.
  const flattened = createMemo<NativeImage>(() => {
    const { width, height } = logoImageSize
    const [r, g, b] = theme.background.base.toInts()
    const pixels = new Uint8Array(width * height * 4)
    for (let i = 0; i < pixels.length; i += 4) pixels.set([r, g, b, 255], i)
    const base = NativeImage.fromRgba(pixels, width, height)
    const art = NativeImage.decode(logoImage)
    const result = base.composite(art)
    base.dispose()
    art.dispose()
    return result
  })

  const imageWidth = () => Math.min(76, dimensions().width - 6)
  // Terminal cells are roughly twice as tall as wide, so halve the aspect ratio.
  const imageHeight = () => Math.max(4, Math.round(imageWidth() * (logoImageSize.height / logoImageSize.width) * 0.5))

  const style = CapriConfig.logoStyle()
  const useImage = () => style !== "quadrant" && style !== "halfblock" && inline()
  const compact = () => dimensions().width < 84 || dimensions().height < 30

  return (
    <box>
      {dimensions().width < 48 || dimensions().height < 16 ? null : useImage() ? (
        <image source={flattened()} fit="fit" protocol="auto" width={imageWidth()} height={imageHeight()} />
      ) : style === "halfblock" ? (
        <Art art={compact() ? halfblockLogo.small : halfblockLogo.large} colors={halfblockColors} />
      ) : (
        <Art art={compact() ? logo.small : logo.large} colors={quadrantColors} />
      )}
    </box>
  )
}
