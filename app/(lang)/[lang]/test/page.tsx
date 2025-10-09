import { initWorkplace } from "./actions";
import WorkplaceClient from "./WorkplaceClient";

export default async function Page() {
    // If you track headId elsewhere (e.g., Workspace table / cookies), pass it here.
    const { headId, messages, generator } = await initWorkplace("b81315d3-0801-4282-9c6a-6c7c250c7e9e");

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
