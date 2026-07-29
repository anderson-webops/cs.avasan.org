import type {
	GraphSketcherArchiveWorkerRequest,
	GraphSketcherArchiveWorkerResponse
} from "@/modules/graphSketcherArchive";
import {
	extractLegacyGraphXmlFromArchive,
	safeGraphArchiveErrorMessage
} from "@/modules/graphSketcherArchive";

interface GraphSketcherArchiveWorkerScope {
	onmessage:
		| ((event: MessageEvent<GraphSketcherArchiveWorkerRequest>) => void)
		| null;
	postMessage: (message: GraphSketcherArchiveWorkerResponse) => void;
}

const workerScope = globalThis as unknown as GraphSketcherArchiveWorkerScope;

workerScope.onmessage = event => {
	try {
		const request = event.data;
		const xml = extractLegacyGraphXmlFromArchive(
			new Uint8Array(request.archive),
			request.maxArchiveBytes,
			request.maxXmlBytes
		);
		workerScope.postMessage({ ok: true, xml });
	} catch (error) {
		workerScope.postMessage({
			ok: false,
			message: safeGraphArchiveErrorMessage(error)
		});
	}
};
