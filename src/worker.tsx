import { Hono } from "hono";
import { serveStatic } from 'hono/cloudflare-workers';
import { htmx } from "./htmx";
import Layout from "./components/layout";
import { ACMDomains, ACMElements, ACMHome, AddCompetenceButton, BookCover, BookForm, Books, CompetenceList } from "./components/acm";
import { AddAspectButton, CompetenceCover, CompetenceDescriptor, CompetenceNav } from "./components/competence";
import { Frame, FrameHead, FrameInner } from "./components/frames";
import { CompetenceLevels } from "./components/level";
import { CompetenceAspects } from "./components/aspect";
import { html } from "hono/html";


const app = new Hono<{ Bindings: Env }>({ strict: false });
app.get('/static/*', serveStatic({ root: './' }));

app.get('/', (c) => {
	return c.html(
		<Layout>
			<a class="text-xl text-blue-500 hover:underline hover:text-blue-600" href="/acm">Click to enter ACM Home</a>
			{/* <p>SEDANG MAINTENANCE DATABASE</p> */}
		</Layout>
	)
})

app.get('/acm', async (c) => {
	const sql = 'SELECT * FROM acm_books';
	const rs = await c.env.DB.prepare(sql).all();
	return c.html(
		<Layout>
			<p class="flex flex-row gap-3 text-sm uppercase tracking-wider mb-2">
				<a href="/acm" class="text-blue-600">
					Home
				</a>
				<span>/</span>
				<a href="/acm/elements" class="text-blue-600">
					Elements
				</a>
			</p>
			{/*
			<h2 class="text-2xl font-bold mb-5">ACM Repositories</h2>
			<a
				class="block w-full bg-orange-500 text-center text-white font-medium p-2 mb-4"
				href="/acm/new"
			>
				New Repository
			</a>
			<div id="main">
				<Books items={rs.results as CompetenceBook[]} />
			</div> */}
			<ACMHome books={rs.results as CompetenceBook[]} />
		</Layout>
	);
});

app.get('/acm/elements/:domain?', async (c) => {
	const domain = (c.req.param('domain') || 'EMO') as ACMDomain;
	const sql = `SELECT * FROM acm_elements WHERE type is not 'generic' AND domain=?`;
	const { results } = await c.env.DB.prepare(sql).bind(domain).all();
	return c.html(
		<Layout>
			<p class="flex flex-row gap-3 text-sm uppercase tracking-wider mb-2">
				<a href="/acm" class="text-blue-600">
					Home
				</a>
			</p>
			<h2 class="text-2xl font-bold mb-5">ACM Elements</h2>
			<div id="main" class="mb-[300px]">
				<ACMDomains value={domain} />
				<ACMElements items={results as ACMElement[]} />
			</div>
		</Layout>
	);
});

app.get('/acm/:book_id', async (c) => {
	const id = c.req.param('book_id');
	const sql1 = 'SELECT * FROM acm_books WHERE id=?';
	const sql2 = 'SELECT * FROM acm_competences WHERE book_id=?';
	// const found = await c.env.DB.prepare(sql).bind(id).first();
	// if (!found) return c.notFound();

	const db = c.env.DB;
	const rs = await db.batch([
		db.prepare(sql1).bind(id),
		db.prepare(sql2).bind(id),
	])

	if (rs[0].results.length == 0) {
		c.status(404);
		return c.body(null)
	}

	const book = rs[0].results[0] as CompetenceBook;
	const items = rs[1].results as Competence[]
	return c.html(
		<Layout>
			<p class="flex flex-row gap-3 text-sm uppercase tracking-wider mb-2">
				<a href="/acm" class="text-blue-600">
					Home
				</a>
			</p>
			<BookCover book={book} />
			<CompetenceList items={items} />
			<AddCompetenceButton book_id={book.id} />
		</Layout>
	);
})

app.get('/acm/c/:competence_id', async (c) => {
	const id = c.req.param('competence_id');
	const sql1 = `SELECT b.title, b.type, b.levels level, c.* FROM acm_competences c LEFT JOIN acm_books b ON c.book_id=b.id WHERE c.id=?`;
	const found: any = await c.env.DB.prepare(sql1).bind(id).first();

	if (!found) {
		c.status(404);
		return c.html(
			<Layout>
				<h1>404 Not Found</h1>
			</Layout>
		);
	}

	const { title, type, level } = found;
	const competence = found as Competence;

	// Load indicators, aspects, levels
	const sql2 = `SELECT * FROM acm_aspects WHERE competence_id=?`;
	const sql3 = `SELECT * FROM acm_levels WHERE competence_id=?`;
	const sql4 = `SELECT * FROM acm_indicators WHERE competence_id=?`;
	const [{ results: aspects }, { results: levels }, { results: indicators }] = await c.env.DB.batch([
		c.env.DB.prepare(sql2).bind(id),
		c.env.DB.prepare(sql3).bind(id),
		c.env.DB.prepare(sql4).bind(id),
	]);

	return c.html(
		<Layout>
			<CompetenceNav book_id={competence.book_id} />
			<CompetenceCover title={title} type={type} level={level} />
			<CompetenceDescriptor item={competence} indicators={indicators as CompetenceIndicator[]} />

			{/* TEST */}
			<Frame>
				<FrameHead title="🚗 Frame Title" />
				<FrameInner>
					<div class="flex items-start px-3 py-2">
						<label class="w-[90px] shrink-0 text-xs text-slate-400 uppercase font-bold pt-[10px] cursor-pointer">Name</label>
						<div class="flex-grow leading-5 font-semibold py-[7px]">Array of gitignore-style patterns that match</div>
					</div>
				</FrameInner>
				<FrameInner>
					<div class="flex items-start px-3 py-2">
						<label class="w-[90px] shrink-0 text-xs text-slate-400 uppercase font-semibold pt-[10px] cursor-pointer">Definition</label>
						<div class="flex-grow leading-[1.4rem] py-[7px]">
							Array of gitignore-style patterns that match. Does not require a Worker script to serve your assets.
						</div>
					</div>
				</FrameInner>
				<FrameInner>
					<div class="flex items-start bg-slate-50 px-3 py-2">
						<label class="w-[90px] shrink-0 text-xs text-green-500 uppercase font-bold pt-[12px] cursor-pointer">Definition</label>
						<input id="INPUT" type="text" class="flex-grow py-[7px]" />
					</div>
				</FrameInner>
				<FrameInner>
					<div class="flex items-start px-3 py-2">
						<label class="w-[90px] shrink-0 text-xs text-slate-400 uppercase font-semibold pt-[10px] cursor-pointer">Indicators</label>
						<div class="flex-grow flex flex-col gap-2 leading-5 py-[7px]">
							<label>◆ Does not require a Worker script to serve your assets.</label>
							<label>◆ Does not need a Worker helper.</label>
						</div>
					</div>
				</FrameInner>
				{html`
<script>
	document.getElementById('INPUT').addEventListener('keydown', (event) => {
		if (event.key == 'Escape') {
			console.log('Escape');
		}
	});
</script>
				`}
			</Frame>

			{type == 'grading' && <CompetenceLevels items={levels as CompetenceLevel[]} />}

			<CompetenceAspects items={aspects as Aspect[]} />

			<br />
			<AddAspectButton competence_id={competence.id} />

			<div class="h-[300px]"></div>
		</Layout>
	);
})

// HTMX
app.route('/htmx', htmx);

export default app;
