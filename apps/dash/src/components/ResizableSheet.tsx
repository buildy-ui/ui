import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { cn } from "@ui8kit/core";

export interface ResizableSheetProps {
	id: string;
	title?: string;
	children?: ReactNode;
	defaultWidthRem?: number; // default: 28rem
	maxWidthPercent?: number; // default: 50 (50vw)
	className?: string;
}

function getRootFontSizePx(): number {
	if (typeof window === "undefined") return 16;
	const root = window.getComputedStyle(document.documentElement);
	const size = parseFloat(root.fontSize || "16");
	return Number.isFinite(size) ? size : 16;
}

export function ResizableSheet({
	id,
	title,
	children,
	defaultWidthRem = 28,
	maxWidthPercent = 80,
	className,
}: ResizableSheetProps) {
	const [viewportWidth, setViewportWidth] = useState<number>(() =>
		typeof window !== "undefined" ? window.innerWidth : 1920
	);

	useEffect(() => {
		function onResize() {
			setViewportWidth(window.innerWidth);
		}
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const { defaultPercent, minPercent, maxPercent } = useMemo(() => {
		const remPx = getRootFontSizePx();
		const targetPx = defaultWidthRem * remPx; // 28rem -> px
		const pct = (targetPx / Math.max(1, viewportWidth)) * 100;
		const computed = Math.min(maxWidthPercent, Math.max(0, pct));
		return {
			defaultPercent: computed,
			minPercent: Math.min(maxWidthPercent, computed),
			maxPercent: maxWidthPercent,
		};
	}, [defaultWidthRem, maxWidthPercent, viewportWidth]);

	return (
		<div className={cn("relative", className)} data-class="resizable-sheet">
			<input id={id} type="checkbox" className="peer hidden" />

			<div className="fixed inset-0 z-50 hidden peer-checked:block" data-class="resizable-sheet-portal">
				{/* Overlay captures clicks to close (below panel/handle) */}
				<label
					htmlFor={id}
					aria-label="Close overlay"
					className="absolute inset-0 bg-card/50 cursor-pointer z-10"
					data-class="resizable-sheet-overlay"
				/>

				{/* Panels layer above overlay; only right panel and handle accept pointer events */}
				<div className="absolute inset-0 z-20 pointer-events-none" data-class="resizable-sheet-panels">
					<PanelGroup direction="horizontal" autoSaveId={`${id}-panels`} className="h-full w-full">
						{/* Filler area to the left */}
						<Panel id={`${id}-left`} order={1} defaultSize={100 - defaultPercent} minSize={100 - maxPercent} className="h-full" />

						<PanelResizeHandle
							data-class="resize-handle"
							className="pointer-events-auto w-px bg-border data-[panel-group-direction=horizontal]:cursor-col-resize data-[resize-handle-state=hover]:w-1 data-[resize-handle-state=drag]:w-1"
						/>

						{/* Right sheet panel */}
						<Panel
							id={`${id}-right`}
							order={2}
							defaultSize={defaultPercent}
							minSize={minPercent}
							maxSize={maxPercent}
							className="pointer-events-auto h-full max-w-full bg-card border-l border-border p-4"
						>
							<div className="flex items-center justify-between" data-class="sheet-header">
								{title ? (
									<span className="text-sm text-muted-foreground" data-class="sheet-title">{title}</span>
								) : (
									<span />
								)}
								<label
									htmlFor={id}
									aria-label="Close"
									data-class="sheet-close-button"
									className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground cursor-pointer"
								>
									✕
								</label>
							</div>
							<div className="mt-4" data-class="sheet-content">
								{children}
							</div>
						</Panel>
					</PanelGroup>
				</div>
			</div>
		</div>
	);
}

ResizableSheet.displayName = "ResizableSheet";


