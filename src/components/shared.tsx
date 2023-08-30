import { FrameDefinition, FrameInner, FrameLabel, FrameLabelEditing, FrameName } from "./frames";

export const ItemName = ({ item, field, path }: { item: any; field: string; path: string }) => {
	return (
		<FrameInner>
			<FrameLabel title="Name" url={`${path}/${item.id}`} target="closest section" swap="outerHTML" />
			<FrameName value={item[field] || 'Untitled'} />
		</FrameInner>
	);
};

export const ItemDefinition = ({ item, field, path }: { item: any; field: string; path: string }) => {
	return (
		<FrameInner>
			<FrameLabel title="Definition" url={`${path}/${item.id}`} target="closest section" swap="outerHTML" />
			<FrameDefinition value={item[field] || 'Not defined'} />
		</FrameInner>
	);
}

export const ItemNameForm = ({ item, field, path }: { item: any; field: string; path: string }) => (
	<FrameInner>
		<FrameLabelEditing title="Name" url={`${path}/${item.id}`} />
		<form class="px-3 pt-1 pb-2 m-0" hx-put={`${path}/${item.id}`} hx-target="closest section" hx-swap="outerHTML">
			<input type="text" name={field} value={item[field]} autofocus class="w-full py-2" />
		</form>
	</FrameInner>
);

export const ItemDefinitionForm = ({ item, field, path }: { item: any; field: string; path: string }) => (
	<FrameInner>
		<FrameLabelEditing title="Definition" url={`${path}/${item.id}`} />
		<form class="px-3 pt-1 pb-2 m-0" hx-put={`${path}/${item.id}`} hx-target="closest section" hx-swap="outerHTML">
			<input type="text" name={field} value={item[field] as string} autofocus class="w-full py-2" />
		</form>
	</FrameInner>
);
