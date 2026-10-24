import { For } from "solid-js"
import { RGBA } from "@opentui/core"
import { useTerminalDimensions } from "@opentui/solid"
import { logo, palette, type LogoArt } from "../logo"

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

  return (
    <box>
      {dimensions().width < 48 || dimensions().height < 16 ? null : dimensions().width < 84 || dimensions().height < 30 ? (
        <Art art={logo.small} />
      ) : dimensions().width < 118 || dimensions().height < 38 ? (
        <Art art={logo.large} />
      ) : (
        <Art art={logo.xlarge} />
      )}
    </box>
  )
}
