import { createMemo, createSignal, For, onCleanup } from "solid-js"
import { NativeImage, RGBA } from "@opentui/core"
import { useRenderer, useTerminalDimensions } from "@opentui/solid"
import { logo, palette, type LogoArt } from "../logo"
import { useTheme } from "../context/theme"
import { logoImage, logoImageSize } from "../logo-image"

const colors = palette.map((hex) => RGBA.fromHex(hex))

function Art(props: { art: LogoArt }) {
  return (
    <For each={props.art}>
      {(row) => (
        <box flexDirection="row">
          <For each={row}>
            {([text, fg, bg]) => (
              <text
                fg={fg === null ? undefined : colors[fg]}
                bg={bg === null ? undefined : colors[bg]}
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

  return (
    <box>
      {dimensions().width < 48 || dimensions().height < 16 ? null : inline() ? (
        <image
          source={flattened()}
          fit="fit"
          protocol="auto"
          width={imageWidth()}
          height={imageHeight()}
        />
      ) : dimensions().width < 84 || dimensions().height < 30 ? (
        <Art art={logo.small} />
      ) : (
        <Art art={logo.large} />
      )}
    </box>
  )
}
