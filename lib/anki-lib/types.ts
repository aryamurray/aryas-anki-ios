import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";

export interface Card {

}

export interface DeckMeta {
    name:string
    cardQuantity:number
    lastReviewed:Date
}

export type AnkiDb = SQLiteAnyDatabase
