import { initWorkplace } from "./actions";
import WorkplaceClient from "./WorkplaceClient";

export default async function Page() {
    // If you have a saved headId per workspace, pass it here; else undefined to start fresh
    const { headId, messages, generator } = await initWorkplace("6ba729e7-4ad7-4e36-9edb-31a997f7fe31");
    return (
        <div className="py-8">
            <WorkplaceClient
                initialHeadId={headId}
                initialMessages={messages}
                initialGenerator={generator}
            />
        </div>
    );
}
