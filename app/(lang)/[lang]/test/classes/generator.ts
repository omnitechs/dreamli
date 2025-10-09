//generator.ts
import type {
    Image,
    Generator as GeneratorType,
    DesignatedSlot,
} from "./interface";

export default class Generator implements GeneratorType {
    type: "text" | "image";
    textPrompt: string;
    images: Image[];
    designated: Partial<Record<DesignatedSlot, Image | null>>;
    dirtySinceLastModel: boolean = false;
    approvalSet?: string[] | undefined;

    constructor(type: "text" | "image" = "text") {
        this.type = type;
        this.textPrompt = "";
        this.images = [];
        this.designated = {
            front: null,
            back: null,
            side: null,
            threeQuarter: null,
            top: null,
            bottom: null,
        };
    }



    setType(type: "text" | "image") {
        this.type = type;
    }

    addImage(image: Image) {
        this.images.push(image);
    }

    assignImage(slot: keyof typeof this.designated, image: Image) {
        this.designated[slot] = image;
    }

    updatePrompt(text: string) {
        if (this.type !== "text") throw new Error("Cannot update text in image mode");
        this.textPrompt = text;
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



