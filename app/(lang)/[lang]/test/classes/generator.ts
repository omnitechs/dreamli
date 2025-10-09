//generator.ts
import type {
    Image,
    Generator as GeneratorType,
    DesignatedSlot,
    Message,
    MessageRole, OnChangeFn, GeneratorActionType
} from "./interface";
import uid from "../helper/uuid";

export default class Generator implements GeneratorType {
    type: "text" | "image";
    textPrompt: string;
    images: Image[];
    designated: Partial<Record<DesignatedSlot, Image | null>>;
    dirtySinceLastModel: boolean = false;
    approvalSet?: string[] | undefined;
    messages: Message[];
    private onChange?: OnChangeFn;

    constructor(type: "text" | "image" = "text", onChange?: OnChangeFn) {
        this.type = type;
        this.textPrompt = "";
        this.images = [];
        this.messages = [];
        this.designated = {
            front: null,
            back: null,
            side: null,
            threeQuarter: null,
            top: null,
            bottom: null,
        };
        this.onChange = onChange;
    }

    /** Allow wiring the listener later if needed */
    setOnChange(fn?: OnChangeFn) {
        this.onChange = fn;
    }

    private notify(type: GeneratorActionType | undefined, payload?: Record<string, any>, message?: Message) {
        this.dirtySinceLastModel = true;
        this.onChange?.({ type, payload, message });
    }



    setType(type: "text" | "image") {
        this.type = type;
        this.notify("SET_MODE", { mode: type });
    }

    addImage(image: Image) {
        this.images.push(image);
        this.notify("ADD_IMAGE", { count: 1, imageId: (image as any)?.id ?? undefined });
    }

    assignImage(slot: keyof typeof this.designated, image: Image) {
        this.designated[slot] = image;
        this.notify("ASSIGN_SLOT", { slot, imageId: (image as any)?.id ?? undefined });
    }

    clearSlot(slot: keyof typeof this.designated) {
        this.designated[slot] = null;
        this.notify("CLEAR_SLOT", { slot });
    }

    updatePrompt(text: string) {
        if (this.type !== "text") throw new Error("Cannot update text in image mode");
        this.textPrompt = text;
        this.notify("UPDATE_TEXT", { length: text.length });
    }

    addMessage(text: string, role: MessageRole = "user"):void {
        const msg: Message = {
            id: uid(),
            role,
            content: text,
            createdAt: new Date().toISOString(),
        };
        this.messages.push(msg);
        // This is a *message* (chat), not a system action; we still want a commit.
        this.notify(undefined, undefined, msg);
    }

    toJSON() {
        return {
            type: this.type,
            textPrompt: this.textPrompt,
            images: this.images,
            designated: this.designated,
            dirtySinceLastModel: this.dirtySinceLastModel,
        };
    }
}



