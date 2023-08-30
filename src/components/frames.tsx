export const Frame = ({ children }: { children: any }) => <div class="border border-gray-300 overflow-hidden my-4">{children}</div>;

export const FrameHead = ({ title }: { title: string }) => <div class="bg-gray-200 font-semibold px-3 py-2">{title}</div>;

export const FrameInner = ({ id, children }: { id?: string; children: any }) => (
	<section id={id} class="border-t border-gray-300 overflow-hidden">
		{children}
	</section>
);

export const FrameLabel = ({ title, url, target, swap }: { title: string; url?: string; target?: string; swap?: string }) => (
	<div class="text-xs text-orange-500 hover:text-red-500 font-semibold uppercase tracking-wider px-3">
		<label class="group inline-block pr-2 pt-2" hx-get={url} hx-target={target} hx-swap={swap}>
			<span>{title}</span>
			<span class="hidden px-1 group-hover:inline">✎</span>
		</label>
	</div>
);

export const FrameLabelEditing = ({ title, url }: { title: string; url?: string }) => (
	<div class="text-xs text-green-600 font-semibold uppercase tracking-wider px-3">
		<label class="DDD group inline-block pr-2 pt-2" hx-get={url} hx-target="closest section" hx-swap="outerHTML">
			<span>{title}</span>
		</label>
	</div>
);

export const FrameName = ({ value }: { value: string }) => <p class="font-medium px-6 pt-2 pb-3">{value}</p>;

export const FrameDefinition = ({ value }: { value: string }) => <p class="px-6 pt-2 pb-3">{value}</p>;

export const IndicatorsBox = ({ id, children }: { id?: string; children: any }) => (
	<div id={id} class="flex flex-col gap-1 pl-10 pr-6 pt-2 pb-3">
		{children}
	</div>
);
