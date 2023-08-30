import { Domains } from "../constants";

export const ACMHome = ({ books }: { books: CompetenceBook[] }) => (
	<div id="main">
		<h2 class="text-2xl font-bold mb-5">ACM Repositories</h2>
		<button
			class="block w-full bg-orange-500 text-center text-white font-medium p-2 mb-4"
			hx-get="/htmx/book-form"
			hx-target="#main"
			hx-swap="outerHTML"
		>
			New Repository
		</button>
		<div id="books">
			<Books items={books} />
		</div>
	</div>
);

export const ACMDomains = ({ value }:{ value: ACMDomain }) => (
	<div class="flex flex-wrap gap-2">
		{Domains.map((d) => (
			<button
				class={d == value ? 'bg-gray-600 border border-gray-800 text-white px-2' : 'bg-gray-100 border border-slate-400 px-2'}
				hx-get={`/htmx/elements/${d}`}
				hx-target="#main"
				hx-swap="innerHTML"
			>
				{d}
			</button>
		))}
	</div>
);

export const ACMElements = ({ items }: { items: ACMElement[] }) => (
	<div>
		<table class="w-full my-6">
			<thead class="bg-slate-100 border-b border-slate-500 font-semibold">
				<tr>
					<td class="p-2">
						<div class="w-10">ID</div>
					</td>
					{/* <td class="p-2">Tipe</td> */}
					<td width="80%" class="p-2">
						<div class="flex gap-4">
							<span class="flex--grow">Nama Element</span>
							<span>({items.length})</span>
						</div>
					</td>
					<td class="p-2">
						<div class="w-28">Tool</div>
					</td>
				</tr>
			</thead>
			{items.map((elm) => (
				<tbody>
					<ElementItem target={`/htmx/element-with-evidences/${elm.id}`} item={elm} />
				</tbody>
			))}
		</table>
		{/* <div class="h-[300px]"></div> */}
	</div>
);

export const ElementItem = ({ item, target }: { item: ACMElement, target: string }) => (
	<tr
		class="border-b border-slate-300 cursor-pointer"
		hx-get={target}
		hx-target="closest tbody"
		hx-swap="outerHTML"
	>
		<td class="p-2">{item.id}</td>
		<td class="p-2">{item.name}</td>
		<td class="text-slate-500 break-keep uppercase p-2">{item.tool}</td>
	</tr>
);

export const ElementEvidences = ({ items }: { items: ACMEvidence[] }) => (
	<tr class="border-b border-slate-300 bg-slate-50">
		<td class="p-2"></td>
		<td colspan="2" class="px-2 py-3">
			<div class="flex flex-col gap-2">
				{items.map((ev) => (
					<p class="text-sm">
						<span class="font-semibold">{ev.name}: </span>
						<span class="">{ev.definition}</span>
					</p>
				))}
			</div>
		</td>
	</tr>
);

export const __ElementDetails = ({ item, details }: { item: ACMElement; details: ACMEvidence[] }) => (
	<tbody>
		<tr class="border-b border-slate-300 cursor-pointer">
			<td class="p-2">{item.id}</td>
			<td class="p-2">{item.name}</td>
			<td class="text-slate-500 break-keep uppercase p-2">CASE-COG</td>
		</tr>
		<tr class="border-b border-slate-300 bg-slate-50">
			<td class="p-2"></td>
			<td colspan="2" class="p-2">
				<div class="flex flex-col gap-1">
					{details.map((ev) => (
						<p class="text-sm">
							<span class="font-semibold">{ev.name}: </span>
							<span class="">{ev.definition}</span>
						</p>
					))}
				</div>
			</td>
		</tr>
	</tbody>
);

export const ACMForm = () => (
	<div id="main">
		<h2 class="text-2xl font-bold mb-5">Create New Repository</h2>
		<BookForm />
	</div>
);

export const Books = ({ items }: { items: CompetenceBook[] }) => (
	<section class="mb-4">
		{items.map((book) => (
			<div class="">
				<a class="text-lg text-blue-500 hover:underline" href={`/acm/${book.id}`}>
					{book.title} ({book.type})
				</a>
			</div>
		))}
	</section>
);

export const BookForm = ({ title, error }: { title?: string; error?: string }) => (
	<form class="flex flex-col gap-3 border border-gray-400 p-4" hx-post="/htmx/books/new" hx-target="this" hx-swap="outerHTML">
		<div>
			<label class="text-sm uppercase tracking-wider">Title</label>
			<input type="text" name="title" autofocus value={title} class="w-full" placeholder="Minimal 10 karakter" />
		</div>
		<div>
			<label class="text-sm uppercase tracking-wider">Type</label>
			<select name="type" class="w-full" hx-get="/htmx/books/level" hx-target="#book-levels" hx-swap="innerHTML">
				<option value="listing">Listing</option>
				<option value="grading">Grading</option>
			</select>
		</div>
		<div>
			<label class="text-sm uppercase tracking-wider">Levels</label>
			<select id="book-levels" name="level" class="w-full">
				<option value="0">0</option>
			</select>
		</div>
		<div class="flex gap-3 pt-3">
			<button type="submit" class="flex-grow text-white font-medium bg-orange-500 p-2">
				Submit
			</button>
			<button
				class="border border-gray-400 text-center font-medium px-6 py-2"
				hx-get="/htmx/books"
				hx-target="#main"
				hx-swap="outerHTML"
			>
				Cancel
			</button>
		</div>
		<p id="error" class="text-sm text-orange-600">{error}</p>
	</form>
);

export const BookCover = ({ book }: { book: CompetenceBook }) => (
	<div class="pb-3 mb-4 border-b-2">
		<h1 class="text-2xl font-bold mb-3">Buku Kompetensi</h1>
		<p class="mb-1">Title: {book.title}</p>
		<p class="mb-1">
			Type:{` `}
			<span>{book.type.toUpperCase()}</span>
			{book.type == 'grading' && <span class=""> - {book.levels} Levels</span>}
		</p>
	</div>
);

export const CompetenceList = ({ items }: { items: Competence[] }) => (
	<div>
		<h2 class="text-lg font-bold mt-5 mb-3">Daftar Kompetensi</h2>
		<div id="new-competences" class="flex flex-col gap-1 mb-1">
			{items.map((item) => (
				<a href={`/acm/c/${item.id}`} class="bg-gray-100 hover:bg-gray-200 px-3 py-[7px]">{item.name}</a>
			))}
		</div>
		<div id="__new-competences" class="flex flex-col gap-1 mb-4"></div>
	</div>
);

export const AddCompetenceButton = ({ book_id }: { book_id: string }) => (
	<form class="rounded border text-center p-3 m-0" hx-get={`/htmx/add-competence-form/${book_id}`} hx-target="this" hx-swap="outerHTML">
		<button class="py-[7px]">Add New Competence</button>
	</form>
);

export const AddCompetenceForm = ({ book_id, type, level }: { book_id: string; type: string; level: number }) => (
	<form
		id="AddCompetenceForm"
		class="flex gap-2 rounded border p-3 m-0"
		hx-post={`/htmx/competences`}
		hx-target="#new-competences"
		hx-swap="beforeend"
		_="on htmx:afterRequest reset() me"
	>
		<input type="hidden" name="book_id" value={book_id} />
		<input type="hidden" name="level" value={level} />
		<input type="hidden" name="type" value={type} />
		<input type="text" name="name" autofocus class="flex-grow py-[7px]" />
		<button class="border px-4">Add</button>
		<button class="border px-4" hx-get={`/htmx/add-competence-button/${book_id}`} hx-target="closest form" hx-swap="outerHTML">
			Cancel
		</button>
	</form>
);
