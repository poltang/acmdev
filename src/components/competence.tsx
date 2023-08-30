import { Frame, FrameHead, FrameInner, FrameLabel, FrameLabelEditing, IndicatorsBox } from "./frames";
import { ItemDefinition, ItemName } from "./shared";

export const CompetenceNav = ({ book_id }: { book_id: string }) => (
	<p class="flex flex-row gap-3 text-sm text-gray-300 uppercase tracking-wider mb-2">
		<a href="/acm" class="text-blue-600">
			Home
		</a>
		<span>/</span>
		<a href={`/acm/${book_id}`} class="text-blue-600">
			Buku
		</a>
	</p>
);

export const CompetenceCover = ({ title, type, level }: { title: string; type: string; level: number }) => (
	<div class="pb-3 mb-4 border-b-2">
		<h1 class="text-2xl font-bold mb-3">Spesifikasi Kompetensi</h1>
		<p class="mb-1">Title: {title}</p>
		<p class="mb-1">
			Type:{` `}
			<span>{type.toUpperCase()}</span>
			{type == 'grading' && <span class=""> - {level} Levels</span>}
		</p>
	</div>
);

export const CompetenceDescriptor = ({ item, indicators }: { item: Competence; indicators: CompetenceIndicator[] }) => (
	<Frame>
		<FrameHead title="Competence Descriptor" />
		<ItemName item={item} field="name" path="/htmx/competence-name-form" />
		<ItemDefinition item={item} field="definition" path="/htmx/competence-definition-form" />
		<CompetenceIndicators id={item.id} items={indicators} />
	</Frame>
);

export const CompetenceIndicators = ({ id, items }: { id: string; items: any[] }) => (
	<FrameInner>
		<FrameLabel title="Indicators" url={`/htmx/competence-indicators-form/${id}`} target="closest section" swap="outerHTML" />
		<IndicatorsBox>
			{items.map((item: CompetenceIndicator) => (
				<CompetenceIndicatorItem item={item} />
			))}
		</IndicatorsBox>
	</FrameInner>
);

export const CompetenceIndicatorsForm = ({ id, items }: { id: string; items: any[] }) => (
	<FrameInner>
		<FrameLabelEditing title="Indicators" url={`/htmx/competence-indicators/${id}`} />
		<div id="competence-indicators" class="flex flex-col gap-1 px-3 pt-2">
			{items.map((item) => (
				<DeleteableCompetenceIndicator id={item.id} value={item.name} />
			))}
		</div>

		{/* <div id="more-items" class="flex flex-col gap-1 px-3 pt-1"></div> */}
		<AddCompetenceIndicator id={id} />
	</FrameInner>
);

export const AddCompetenceIndicator = ({ id }: { id: string }) => (
	<div class="flex flex-col gap-1 px-3 pt-3 pb-2">
		<form
			class="m-0"
			hx-post={`/htmx/competence-indicators/${id}`}
			hx-target="#competence-indicators"
			hx-swap="beforeend"
			_="on htmx:afterRequest reset() me"
		>
			<input type="text" name="name" autofocus placeholder="Minimum 10 characters" class="w-full py-[6px]" />
		</form>
	</div>
);

export const CompetenceIndicatorItem = ({ item }: { item: CompetenceIndicator }) => (
	<p class="leading-tight before:block before:float-left before:content-['★'] before:text-xs before:text-orange-300 before:pt-[2px] before:-ml-4">
		{item.name}
	</p>
);

export const DeleteableCompetenceIndicator = ({ id, value }: { id: number; value: string }) => (
	<form class="group flex gap-1 m-0" hx-delete={`/htmx/competence-indicators/${id}`} hx-swap="outerHTML">
		<div class="flex-grow bg-gray-200 group-hover:bg-gray-300 px-3 py-[6px]">{value}</div>
		<button class="bg-gray-200 hover:bg-red-700 hover:text-white text-sm font-medium px-3">Del</button>
	</form>
);

export const AddAspectButton = ({ competence_id }: { competence_id: string }) => (
	<form
		class="rounded border border-slate-400 text-center p-3 m-0"
		hx-get={`/htmx/add-aspect-form/${competence_id}`}
		hx-target="this"
		hx-swap="outerHTML"
	>
		<button class="w-full py-[7px]">Add New Aspect</button>
	</form>
);

export const AddAspectForm = ({ competence_id }: { competence_id: string }) => (
	<form
		id="AddCompetenceForm"
		class="flex gap-2 rounded border border-slate-400 p-3 m-0"
		hx-post={`/htmx/competence-aspects`}
		hx-target="#competence-aspects"
		hx-swap="beforeend"
		_="on htmx:afterRequest reset() me"
	>
		<input type="hidden" name="competence_id" value={competence_id} />
		<input type="text" name="name" autofocus class="flex-grow py-[7px]" />
		<button class="border border-slate-400 px-4">Add</button>
		<button class="border border-slate-400 px-4" hx-get={`/htmx/add-aspect-button/${competence_id}`} hx-target="closest form" hx-swap="outerHTML">
			Cancel
		</button>
	</form>
);
