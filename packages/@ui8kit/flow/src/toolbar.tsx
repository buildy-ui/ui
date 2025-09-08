import * as React from "react";
import { Button, Icon, Text } from "@ui8kit/core";
import { Pencil, Type, Square, MousePointer, ArrowRight, Play } from "lucide-react";
import { useFlowStore } from "./store";

type Props = {
  modeSwitch?: boolean;
  onRun?: () => void;
};

export function Toolbar({ modeSwitch = true, onRun }: Props) {
  const { mode, setMode, activeTool, setTool, save, clear } = useFlowStore();
  return (
    <div data-class="flow-toolbar">
      <div>
        <Button variant="ghost" onClick={() => setTool("select")} aria-pressed={activeTool === "select"}>
          <Icon lucideIcon={MousePointer} />
        </Button>
        <Button variant="ghost" onClick={() => setTool("rectangle")} aria-pressed={activeTool === "rectangle"}>
          <Icon lucideIcon={Square} />
        </Button>
        <Button variant="ghost" onClick={() => setTool("arrow")} aria-pressed={activeTool === "arrow"}>
          <Icon lucideIcon={ArrowRight} />
        </Button>
        <Button variant="ghost" onClick={() => setTool("text")} aria-pressed={activeTool === "text"}>
          <Icon lucideIcon={Type} />
        </Button>
        <Button variant="ghost" onClick={() => setTool("freehand")} aria-pressed={activeTool === "freehand"}>
          <Icon lucideIcon={Pencil} />
        </Button>
      </div>
      <div>
        <Button onClick={() => save()}>Save</Button>
        <Button variant="outline" onClick={() => clear()}>Clear</Button>
        {modeSwitch && (
          <Button variant="secondary" onClick={() => setMode(mode === "draw" ? "flow" : "draw")}>{mode === "draw" ? "To Flow" : "To Draw"}</Button>
        )}
        {mode === "flow" && (
          <Button onClick={onRun}><Icon lucideIcon={Play} />Run</Button>
        )}
      </div>
    </div>
  );
}


