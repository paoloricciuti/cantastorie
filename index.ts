import { McpServer } from 'tmcp';
import { ValibotJsonSchemaAdapter } from '@tmcp/adapter-valibot';
import { HttpTransport } from '@tmcp/transport-http';
import * as v from 'valibot';

const server = new McpServer(
	{
		name: 'Favole in Italiano MCP Server',
		description: 'Un MCP server per inventare favole in italiano',
		version: '1.0.0',
	},
	{
		adapter: new ValibotJsonSchemaAdapter(),
		capabilities: {
			prompts: {},
		},
	}
);

server.prompt(
	{
		name: 'Inventa una favola',
		description: 'Crea una favola inventata in italiano',
		title: 'Inventa una favola',
		schema: v.object({
			personaggi: v.string(),
		}),
	},
	({ personaggi }) => {
		return {
			messages: [
				{
					role: 'user',
					content: {
						type: 'text',
						text: `Crea una favola meravigliosa e coinvolgente in italiano utilizzando questi personaggi: ${personaggi}.

La favola dovrebbe:
- Essere scritta in un italiano elegante e scorrevole
- Avere una trama interessante e ben strutturata con inizio, sviluppo e conclusione
- Contenere una morale o insegnamento significativo
- Essere adatta a lettori di tutte le età ma particolarmente rivolta a bambini
- Utilizzare tutti i personaggi forniti in modo creativo e organico
- Essere lunga circa 300-500 parole
- Includere dialoghi vivaci e descrizioni evocative

Inizia la favola con "C'era una volta..." e concludila con una morale che insegni qualcosa di importante sulla vita, l'amicizia, il coraggio o altri valori universali.`,
					},
				},
			],
		};
	}
);

const transport = new HttpTransport(server);

Bun.serve({
	port: 3000,
	async fetch(request) {
		const response = await transport.respond(request);
		if (response) {
			return response;
		}
		return new Response('Not Found', { status: 404 });
	},
	idleTimeout: 255,
	websocket: {
		message() {},
	},
});
