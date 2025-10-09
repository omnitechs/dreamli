interface Message{
    user : string;

}
interface Version{
    time: Date;
    hash:string;
    messages : Message[]
    generator: Generator;
    model: Model;
}

interface Model{
    src:string;
}

interface Image{
    src: string;
    alt: string;
    primary: boolean;
    angle: "top" | "bottom" | "left" | "right" | "threeForth";
}


interface Generator {
    images : Image[]
    type: "image" | "text"
}