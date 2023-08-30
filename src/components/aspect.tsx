import { Frame, FrameHead, FrameInner, FrameLabel, FrameLabelEditing } from "./frames";
import { ItemName } from "./shared";

export const CompetenceAspects = ({ items }: { items: Aspect[] }) => (
	<div>
		<h3 class="text-xl font-bold mt-8 mb-2">Competence Aspects</h3>
		<div id="competence-aspects">
			{items.map((item, index) => (
				<CompetenceAspectItem item={item} index={index} />
			))}
		</div>
	</div>
);

export const CompetenceAspectItem = ({ item, index }: { item: Aspect; index: number }) => {
	return (
		<Frame>
			<FrameHead title={`Aspect ${index + 1}`} />
			<ItemName item={item} field="name" path="/htmx/aspect-name-form" />
			<p class="p-4" hx-get={`/htmx/aspect-elements/${item.id}`} hx-trigger="load" hx-swap="outerHTML">
				Loading...
			</p>
		</Frame>
	);
};

export const AspectElements = ({ id, items }: { id: string; items: AspectElement[] }) => (
	<FrameInner>
		<FrameLabel title="Elements" url={`/htmx/aspect-elements-form/${id}`} target="closest section" swap="outerHTML" />
		<div class="flex flex-col gap-1 pl-6 pr-6 pt-2 pb-3">
			{items.map((item: AspectElement) => (
				<AspectElementItem item={item} />
			))}
		</div>
	</FrameInner>
);

const AspectElementItem = ({ item }: { item: AspectElement }) => (
	<p class="leading-tight ml-10">
		<span class="block w-[32px] float-left -ml-10 mt-[2px] text-center text-xs rounded-sm bg-gray-600 text-white">{item.element_id}</span>
		<span>{item.name}</span>
	</p>
);

export const AspectElementsForm = ({ aspect_id, items }: { aspect_id: string; items: AspectElement[] }) => (
	<FrameInner>
		<FrameLabelEditing title="Elements" url={`/htmx/aspect-elements/${aspect_id}`} />
		<div id={`aspects-${aspect_id}`} class="flex flex-col gap-1 px-3 pt-2">
			{items.map((item) => (
				<form class="group flex gap-1 m-0" hx-delete={`/htmx/aspect-elements/${item.id}`} hx-swap="outerHTML">
					<div class="flex-grow bg-gray-200 group-hover:bg-gray-300 px-3 py-[6px]">{item.name}</div>
					<button class="bg-gray-200 hover:bg-red-700 hover:text-white text-sm font-medium px-3">Del</button>
				</form>
			))}
		</div>

		{/* <div class="flex flex-col gap-1 px-3 pt-1"></div> */}
		<AddAspectElement id={aspect_id} />
	</FrameInner>
);

export const AddAspectElement = ({ id }: { id: string }) => (
	<div class="flex flex-col gap-1 px-3 pt-3 pb-2">
		<form
			class="m-0"
			hx-post={`/htmx/aspect-elements/${id}`}
			hx-target={`#aspects-${id}`}
			hx-swap="beforeend"
			_="on htmx:afterRequest reset() me"
		>
			<input type="number" name="element_id" min="1" max="151" autofocus placeholder="1 - 151" class="w-full py-[6px]" />
		</form>
	</div>
);

export const DeleteableAspectElement = ({ id, value }: { id: number; value: string }) => (
	<form class="group flex gap-1 m-0" hx-delete={`/htmx/aspect-elements/${id}`} hx-swap="outerHTML">
		<div class="flex-grow bg-gray-200 group-hover:bg-gray-300 px-3 py-[6px]">{value}</div>
		<button class="bg-gray-200 hover:bg-red-700 hover:text-white text-sm font-medium px-3">Del</button>
	</form>
);
