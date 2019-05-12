export class ItemData {
    constructor(
         public item?: any,
         public stars?: number,
         public reviews?: any,
         public numReviews?: number,
         public relatedItems?: any

    ){}
}

export class Item {
    constructor (
        public category?: String,
        public description?: String,
        public img_url?: String,
        public price?: number,
        public slogan?: String,
        public stars?: number,
        public title?: String,
        public _id?: number
    ){}
}