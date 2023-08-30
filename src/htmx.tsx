import { Hono } from "hono";
import { ulidFactory } from "ulid-workers";
import { ACMDomains, ACMElements, ACMForm, ACMHome, AddCompetenceButton, AddCompetenceForm, BookForm, ElementEvidences, ElementItem } from "./components/acm";
import { AddAspectButton, AddAspectForm, CompetenceIndicators, CompetenceIndicatorsForm, DeleteableCompetenceIndicator } from "./components/competence";
import { DeleteableLevelIndicator, LevelIndicators, LevelIndicatorsForm } from "./components/level";
import { ItemDefinition, ItemDefinitionForm, ItemName, ItemNameForm } from "./components/shared";
import { AspectElements, AspectElementsForm, CompetenceAspectItem, DeleteableAspectElement } from "./components/aspect";

const ulid = ulidFactory();
const htmx = new Hono<{ Bindings: Env }>();

// Middleware
// htmx.use("*", (c, next) => {
// 	//
// })

// Elements

htmx.get('/elements/:domain?', async (c) => {
	const domain = (c.req.param('domain') || 'EMO') as ACMDomain;
	const sql = `SELECT * FROM acm_elements WHERE type is not 'generic' AND domain=?`;
	const { results } = await c.env.DB.prepare(sql).bind(domain).all();
	return c.html(
		<div id="main" class="mb-[300px]">
			<ACMDomains value={domain} />
			<ACMElements items={results as ACMElement[]} />
		</div>
	);
})

htmx.get('/element-item/:element_id', async (c) => {
	const element_id = c.req.param('element_id');
	const sql = 'SELECT * FROM acm_elements WHERE id=?';
	const item = await c.env.DB.prepare(sql).bind(element_id).first();
	return c.html(
		<tbody>
			<ElementItem target={`/htmx/element-with-evidences/${element_id}`} item={item as ACMElement} />
		</tbody>
	);
});

htmx.get('/element-with-evidences/:element_id', async (c) => {
	const element_id = c.req.param('element_id');
	const sql1 = 'SELECT * FROM acm_elements WHERE id=?';
	const sql2 = 'SELECT * FROM acm_evidences WHERE element_id=?';
	const rs = await c.env.DB.batch([
		c.env.DB.prepare(sql1).bind(element_id),
		c.env.DB.prepare(sql2).bind(element_id),
	])
	// return c.json({
	// 	elm: rs[0].results[0],
	// 	evs: rs[1].results,
	// })
	return c.html(
		<tbody>
			<ElementItem target={`/htmx/element-item/${element_id}`} item={rs[0].results[0] as ACMElement} />
			<ElementEvidences items={rs[1].results as ACMEvidence[]} />
		</tbody>
	);
});

// Books

htmx.get('/books', async (c) => {
	const sql = 'SELECT * FROM acm_books';
	const rs = await c.env.DB.prepare(sql).all();
	// return c.html(<Books items={rs.results as CompetenceBook[]} />);
	return c.html(<ACMHome books={rs.results as CompetenceBook[]} />);
});

htmx.get('/book-form', (c) => {
	return c.html(<ACMForm />);
})

htmx.get('/books/level', (c) => {
	const type = c.req.query('type');
	// c.res.headers.append('HX-Redirect', '/test.html');
	if (type == 'listing') return c.html(<option value="0">0</option>);
	if (type == 'grading')
		return c.html(
			<>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="8">8</option>
				<option value="9">9</option>
			</>
		);
	return c.body(null);
})

// htmx.get('/books/new', (c) => {
// 	return c.html(<BookForm />)
// });

htmx.post('/books/new', async (c) => {
	const body = await c.req.parseBody()
	const title = (body.title as string).trim();
	const type = body.type as string;
	const level = body.level as string;

	if (title.length < 10) {
		const message = 'Kolom TITLE harus diisi minimal 10 karakter'
		return c.html(<BookForm title={title} error={message} />)
	}

	const id = ulid();
	const sql = `INSERT INTO acm_books (id,title,type,levels) VALUES (?,?,?,?)`
	const rs = await c.env.DB.prepare(sql).bind(id, title, type, level).run();
	console.log(rs)
	if (rs.success) {
		c.res.headers.append('HX-Redirect', `/acm/${id}`);
		return c.body(null)
	}

	return c.html(<BookForm title={title} error="Server Error" />);
});

// Competence

const getBook = async (db: D1Database, id: string) => {
	const sql = 'SELECT * FROM acm_books WHERE id=?';
	const found = await db.prepare(sql).bind(id).first();
	if (found) return found as CompetenceBook;
	return null;
}

htmx.get('/add-competence-button/:book_id', (c) => {
	const id = c.req.param('book_id')
	return c.html(<AddCompetenceButton book_id={id} />);
});

htmx.get('/add-competence-form/:book_id', async (c) => {
	const id = c.req.param('book_id');
	// Retrieve book to get levels
	const book = await getBook(c.env.DB, id)
	if (!book) {
		c.status(404)
		return c.body(null)
	}

	return c.html(<AddCompetenceForm book_id={id} type={book.type} level={book.levels}  />);
});

// Add new competence
htmx.post('/competences', async (c) => {
	const body = await c.req.parseBody()
	const name = body.name as string;
	const book_id = body.book_id as string;
	const type = body.level as string;
	const level = parseInt(body.level as string);
	const db = c.env.DB;

	// Check name
	if (name.trim().length < 10) {
		c.status(400);
		return c.body(null);
	}


	const comp_id = ulid()
	const aspect_id = ulid();
	const lvid1 = ulid();
	const lvid2 = ulid();
	const lvid3 = ulid();
	const lvid4 = ulid();
	const lvid5 = ulid();
	const lvid6 = ulid();
	const lvid7 = ulid();
	const lvid8 = ulid();
	const lvid9 = ulid();

	const sql_c = 'INSERT INTO acm_competences (id, book_id, name, definition) VALUES (?,?,?,?)';
	const sql_a = 'INSERT INTO acm_aspects (id, competence_id, name) VALUES (?,?,?)';
	const sql_l = 'INSERT INTO acm_levels (id, competence_id, level, name, definition) VALUES (?,?,?,?,?)';


	const def = 'Sample definition';
	const all = [
		db.prepare(sql_c).bind(comp_id, book_id, name, def),
		db.prepare(sql_a).bind(aspect_id, comp_id, 'Sample Aspect'),
		db.prepare(sql_l).bind(lvid1, comp_id, 1, 'Level 1', def),
		db.prepare(sql_l).bind(lvid2, comp_id, 2, 'Level 2', def),
		db.prepare(sql_l).bind(lvid3, comp_id, 3, 'Level 3', def),
		db.prepare(sql_l).bind(lvid4, comp_id, 4, 'Level 4', def),
		db.prepare(sql_l).bind(lvid5, comp_id, 5, 'Level 5', def),
		db.prepare(sql_l).bind(lvid6, comp_id, 6, 'Level 6', def),
		db.prepare(sql_l).bind(lvid7, comp_id, 7, 'Level 7', def),
		db.prepare(sql_l).bind(lvid8, comp_id, 8, 'Level 8', def),
		db.prepare(sql_l).bind(lvid9, comp_id, 9, 'Level 9', def),
	];

	const array = type == 'listing' || level < 1 ? all.filter((_, i) => i < 2) : all.filter((_, i) => i < level + 2);

	const all_rs = await db.batch(array);
	console.log(all_rs[0])


	return c.html(<div class="bg-gray-100 px-3 py-[7px]">{name}</div>);
})

// Competence name

htmx.get('/competence-name/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_competences WHERE id=?').bind(id).first();
	if (!found) return c.notFound()
	return c.html(<ItemName item={found} field="name" path="/htmx/competence-name-form" />);
});

htmx.put('/competence-name/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const name = body.name as string;
	const sql = 'UPDATE acm_competences SET name=? WHERE id=?';
	const rs = await c.env.DB.prepare(sql).bind(name, id).run();
	if (!rs.success) return c.notFound();
	const item = { id, name };
	return c.html(<ItemName item={item} field="name" path="/htmx/competence-name-form" />);
});

htmx.get('/competence-name-form/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_competences WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemNameForm item={found} field="name" path="/htmx/competence-name" />);
});

// Competence definition

htmx.get("/competence-definition/:id", async (c) => {
	const id = c.req.param("id");
	const found = await c.env.DB.prepare('SELECT * FROM acm_competences WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	// return c.html(<CompetenceDefinition item={found} />)
	return c.html(<ItemDefinition item={found} field="definition" path="/htmx/competence-definition-form" />);
})

htmx.put('/competence-definition/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const definition = body.definition as string;
	const sql = 'UPDATE acm_competences SET definition=? WHERE id=?';
	const rs = await c.env.DB.prepare(sql).bind(definition, id).run();
	if (!rs.success) return c.notFound();
	const item = { id, definition}
	return c.html(<ItemDefinition item={item} field="definition" path="/htmx/competence-definition-form" />);
});

htmx.get("/competence-definition-form/:id", async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_competences WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemDefinitionForm item={found} field="definition" path="/htmx/competence-definition" />);
})

// Competence indicators

htmx.get('/competence-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('SELECT * FROM acm_indicators WHERE competence_id=?').bind(id).all();
	if (rs.results.length == 0) return c.html(<p class="p-8">KOSONG</p>)
	return c.html(
		<CompetenceIndicators id={id} items={rs.results} />
	);
});

htmx.get('/competence-indicators-form/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('SELECT * FROM acm_indicators WHERE competence_id=?').bind(id).all();
	return c.html(<CompetenceIndicatorsForm id={id} items={rs.results} />);
});

htmx.post('/competence-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody()
	const name = (body.name as string).trim();
	if (name.length < 10) {
		c.status(400);
		return c.body(null);
	}
	const rs1: any = await c.env.DB.prepare('SELECT seq FROM sqlite_sequence WHERE name=?').bind('acm_indicators').first();
	const new_id = rs1 ? rs1.seq + 1 : 1;
	const rs = await c.env.DB.prepare('INSERT INTO acm_indicators (id, competence_id, name) VALUES (?,?,?)').bind(new_id, id, name).run();
	if (!rs.success) return c.html(<p class="p-8">KOSONG</p>);
	return c.html(<DeleteableCompetenceIndicator id={new_id} value={name} />);
});

htmx.delete('/competence-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('DELETE FROM acm_indicators WHERE id=?').bind(id).run();
	if (!rs.success) return c.html(<p class="p-8">KOSONG</p>);
	c.status(200);
	return c.body(null);
});

// Add aspect

htmx.get('/add-aspect-button/:competence_id', async (c) => {
	const competence_id = c.req.param('competence_id');
	return c.html(<AddAspectButton competence_id={competence_id} />);
})

htmx.get('/add-aspect-form/:competence_id', async (c) => {
	const competence_id = c.req.param('competence_id');
	return c.html(<AddAspectForm competence_id={competence_id} />);
});

htmx.post('/competence-aspects', async (c) => {

	const body = await c.req.parseBody();
	const name = body.name as string;
	const competence_id = body.competence_id as string;
	const id = ulid();
	const sql = 'INSERT INTO acm_aspects (id, competence_id, name) VALUES (?,?,?)';
	const rs = await c.env.DB.prepare(sql).bind(id, competence_id, name).run();
	if (!rs.success) {
		c.status(500)
		return c.body(null);
	}

	const sql2 = 'SELECT count(*) as count FROM acm_aspects WHERE competence_id=?';
	const rs2 = await c.env.DB.prepare(sql2).bind(competence_id).first();
	// console.log(rs2);
	const aspect: Aspect = {
		id,
		competence_id,
		name,
	};

	return c.html(<CompetenceAspectItem item={aspect} index={(rs2?.count as number) -1} />)
});

// Level name

htmx.get('/level-name/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_levels WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemName item={found} field="name" path="/htmx/level-name-form" />);
	// return c.html(<LevelName item={found} />)
})

htmx.get('/level-name-form/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_levels WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	// return c.html(<LevelNameForm item={found} />);
	return c.html(<ItemNameForm item={found} field="name" path="/htmx/level-name" />);
});

htmx.put('/level-name/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const name = body.name as string;
	const sql = 'UPDATE acm_levels SET name=? WHERE id=?';
	const rs = await c.env.DB.prepare(sql).bind(name, id).run();
	console.log(rs);
	if (!rs.success) return c.notFound();
	const item = { id, name };
	return c.html(<ItemName item={item} field="name" path="/htmx/level-name-form" />);
	// return c.html(<LevelName item={item} />);
});

// Level definition

htmx.get('/level-definition/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_levels WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemDefinitionForm item={found} field="definition" path="/htmx/level-definition-form" />);
})

htmx.get('/level-definition-form/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_levels WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemDefinitionForm item={found} field="definition" path="/htmx/level-definition" />);
});

htmx.put('/level-definition/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const definition = body.definition as string;
	const sql = 'UPDATE acm_levels SET definition=? WHERE id=?';
	const rs = await c.env.DB.prepare(sql).bind(definition, id).run();
	console.log(rs);
	if (!rs.success) return c.notFound();
	const item = { id, definition };
	return c.html(<ItemDefinition item={item} field="definition" path="/htmx/level-definition-form" />);
});

// Level indicators

htmx.get('/level-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('SELECT * FROM acm_level_indicators WHERE level_id=?').bind(id).all();
	// if (rs.results.length == 0) return c.html(<p class="p-8">KOSONG</p>);
	return c.html(<LevelIndicators id={id} items={rs.results} />);
});

htmx.get('/level-indicators-form/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('SELECT * FROM acm_level_indicators WHERE level_id=?').bind(id).all();
	// if (rs.results.length == 0) return c.html(<p class="p-8">KOSONG</p>);
	return c.html(<LevelIndicatorsForm id={id} items={rs.results} />);
});

htmx.post('/level-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const name = (body.name as string).trim();
	if (name.length < 10) {
		c.status(400);
		return c.body(null);
	}
	const rs1: any = await c.env.DB.prepare('SELECT seq FROM sqlite_sequence WHERE name=?').bind('acm_level_indicators').first();
	const new_id = rs1 ? rs1.seq + 1 : 1;
	const rs = await c.env.DB.prepare('INSERT INTO acm_level_indicators (id, level_id, name) VALUES (?,?,?)')
		.bind(new_id, id, name)
		.run();
	console.log("RS", rs)
	if (!rs.success) return c.html(<p class="p-8">KOSONG</p>);
	return c.html(<DeleteableLevelIndicator id={new_id} value={name} />);
});

htmx.delete('/level-indicators/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('DELETE FROM acm_level_indicators WHERE id=?').bind(id).run();
	if (!rs.success) return c.html(<p class="p-8">KOSONG</p>);
	c.status(200);
	return c.body(null);
});

// Aspect name

htmx.get('/aspect-name/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_aspects WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	return c.html(<ItemName item={found} field="name" path="/htmx/aspect-name-form" />);
	// return c.html(<LevelName item={found} />)
});

htmx.get('/aspect-name-form/:id', async (c) => {
	const id = c.req.param('id');
	const found = await c.env.DB.prepare('SELECT * FROM acm_aspects WHERE id=?').bind(id).first();
	if (!found) return c.notFound();
	// return c.html(<LevelNameForm item={found} />);
	return c.html(<ItemNameForm item={found} field="name" path="/htmx/aspect-name" />);
});

htmx.put('/aspect-name/:id', async (c) => {
	const id = c.req.param('id');
	const body = await c.req.parseBody();
	const name = body.name as string;
	const sql = 'UPDATE acm_aspects SET name=? WHERE id=?';
	const rs = await c.env.DB.prepare(sql).bind(name, id).run();
	console.log(rs);
	if (!rs.success) return c.notFound();
	const item = { id, name };
	return c.html(<ItemName item={item} field="name" path="/htmx/aspect-name-form" />);
	// return c.html(<LevelName item={item} />);
});

// Aspect elements

htmx.get('/aspect-elements/:aspect_id', async (c) => {
	const id = c.req.param('aspect_id');
	// const rs = await c.env.DB.prepare('SELECT * FROM acm_aspect_elements WHERE aspect_id=?').bind(id).all();
	const sql = 'SELECT e.tool, a.* FROM acm_aspect_elements a LEFT JOIN acm_elements e ON a.element_id=e.id WHERE a.aspect_id=?';
	const rs = await c.env.DB.prepare(sql).bind(id).all();
	console.log(rs.results)
	return c.html(<AspectElements id={id} items={rs.results as AspectElement[]} />);
});

htmx.get('/aspect-elements-form/:aspect_id', async (c) => {
	const id = c.req.param('aspect_id');
	const rs = await c.env.DB.prepare('SELECT * FROM acm_aspect_elements WHERE aspect_id=?').bind(id).all();
	return c.html(<AspectElementsForm aspect_id={id} items={rs.results as AspectElement[]} />)
})

htmx.post('/aspect-elements/:aspect_id', async (c) => {
	const body = await c.req.parseBody();
	const element_id = (body.element_id as string);
	const aspect_id = c.req.param('aspect_id');

	const rs0: any = await c.env.DB.prepare('SELECT seq FROM sqlite_sequence WHERE name=?').bind('acm_aspect_elements').first();
	// const new_id = rs0.seq + 1;
	const new_id = rs0 ? rs0.seq + 1 : 1;

	const sql1 = `INSERT INTO acm_aspect_elements (id, aspect_id, element_id, name)
	VALUES (${new_id}, '${aspect_id}', ${element_id}, (SELECT name FROM acm_elements WHERE id = ${element_id}))`;
	const sql2 = `SELECT * FROM acm_elements WHERE id=?`;

	// const rs = await c.env.DB.prepare(sql).run();
	const [rs1, rs2] = await c.env.DB.batch([
		c.env.DB.prepare(sql1),
		c.env.DB.prepare(sql2).bind(element_id),
	])
	console.log("RS", rs2.results[0])
	return c.html(<DeleteableAspectElement id={new_id} value={(rs2.results[0] as any).name as string} />);
})

htmx.delete('/aspect-elements/:id', async (c) => {
	const id = c.req.param('id');
	const rs = await c.env.DB.prepare('DELETE FROM acm_aspect_elements WHERE id=?').bind(id).run();
	console.log("RS", rs)
	if (!rs.success) return c.html(<p class="p-8">KOSONG</p>);
	c.status(200);
	return c.body(null);
})

/////////////////////////////////
// Export
export { htmx };
