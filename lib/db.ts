import Dexie, { type EntityTable } from "dexie";

interface Identitas {
  id: number;
  nama: string;
  jabatan: string;
}

const db = new Dexie("FriendsDatabase") as Dexie & {
  identitas: EntityTable<
    Identitas,
    "id" // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  identitas: "++id, nama, jabatan", // primary key "id" (for the runtime!)
});

export type { Identitas };
export { db };

