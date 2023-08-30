import { Frame, FrameHead, FrameInner, FrameLabel, FrameLabelEditing, IndicatorsBox } from "./frames";
import { ItemDefinition, ItemName } from "./shared";

export const CompetenceLevels = ({ items }: { items: CompetenceLevel[] }) => (
	<div>
		<h3 class="text-xl font-bold mt-8 mb-2">Competence Levels</h3>
		{items.map(item => <CompetenceLevelItem item={item} />)}
	</div>
);

export const CompetenceLevelItem = ({ item }: { item: CompetenceLevel }) => {
	return (
		<Frame>
			<FrameHead title={`Level ${item.level}`} />
			<ItemName item={item} field="name" path="/htmx/level-name-form" />
			<ItemDefinition item={item} field="definition" path="/htmx/level-definition-form" />
			<p class="p-4" hx-get={`/htmx/level-indicators/${item.id}`} hx-trigger="load" hx-swap="outerHTML">
				Loading...
			</p>
		</Frame>
	);
};

export const LevelIndicators = ({ id, items }: { id: string; items: any[] }) => (
	<FrameInner>
		<FrameLabel title="Indicators" url={`/htmx/level-indicators-form/${id}`} target="closest section" swap="outerHTML" />
		<IndicatorsBox>
			{items.map((item: any) => (
				<LevelIndicatorItem value={item.name} />
			))}
		</IndicatorsBox>
	</FrameInner>
);

export const LevelIndicatorItem = ({ value }: { value: string }) => (
	<p class="leading-tight before:block before:float-left before:content-['★'] before:text-xs before:text-orange-300 before:pt-[2px] before:-ml-4">
		{value}
	</p>
);

export const LevelIndicatorsForm = ({ id, items }: { id: string; items: any[] }) => (
	<FrameInner>
		<FrameLabelEditing title="Indicators" url={`/htmx/level-indicators/${id}`} />
		<div id={`items-${id}`} class="flex flex-col gap-1 px-3 pt-2">
			{items.map((item) => (
				<DeleteableLevelIndicator id={item.id} value={item.name} />
			))}
		</div>

		{/* <div class="flex flex-col gap-1 px-3 pt-1"></div> */}
		<AddLevelIndicator id={id} />
	</FrameInner>
);

export const DeleteableLevelIndicator = ({ id, value }: { id: number; value: string }) => (
	<form class="group flex gap-1 m-0" hx-delete={`/htmx/level-indicators/${id}`} hx-swap="outerHTML">
		<div class="flex-grow bg-gray-200 group-hover:bg-gray-300 px-3 py-[6px]">{value}</div>
		<button class="bg-gray-200 hover:bg-red-700 hover:text-white text-sm font-medium px-3">Del</button>
	</form>
);

export const AddLevelIndicator = ({ id }: { id: string }) => (
	<div class="flex flex-col gap-1 px-3 pt-3 pb-2">
		<form
			class="m-0"
			hx-post={`/htmx/level-indicators/${id}`}
			hx-target={`#items-${id}`}
			hx-swap="beforeend"
			_="on htmx:afterRequest reset() me"
		>
			<input type="text" name="name" autofocus placeholder="Minimum 10 characters" class="w-full py-[6px]" />
		</form>
	</div>
);
