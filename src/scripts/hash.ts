import Hashids from "hashids"

const hashid = new Hashids("bongrano", 5)

const encrypt = (id: number) => hashid.encode(id)
const decrypt = (hash: string) => Number(hashid.decode(hash))

export default { encrypt, decrypt }
