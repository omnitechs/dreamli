import {UUID} from "node:crypto";

/** Utility: RFC4122-ish id generator */
const uid = (): UUID =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
        ? (crypto.randomUUID() as UUID)
        : ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }) as UUID);

export default uid