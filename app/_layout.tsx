import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  openDatabaseSync,
  SQLiteProvider,
} from "expo-sqlite";
import React, { Suspense, useEffect } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as schema from "@/db/schema";
import { count,eq } from "drizzle-orm";
import { Stack } from "expo-router";
import * as Filesystem from 'expo-file-system'

export const DATABASE_NAME = "collection.anki2";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb, { schema });
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    // Define an async function to fetch cards
    const fetchCards = async () => {
      try {
        // Await the result of the query
        const cards = await db.query.cards.findMany();
        const filesinDocuments = await Filesystem.readDirectoryAsync(Filesystem.documentDirectory || '')
        // Log the fetched cards
        console.log("Cards Found:", cards);
        console.log('Document Dir:',filesinDocuments)
      } catch (error) {
        // Handle any errors
        console.error("Error fetching cards:", error);
      }
    };

    // Call the async function
    fetchCards();



    console.log("Success:", success);
    console.log("Error:", error);
  }, [success, error]); // Empty dependency array ensures this runs only once on mount


  const {data:decks, error:queryError} = useLiveQuery(db
    .select({
      name:schema.decks.name,
      deck_id: schema.decks.id,
      card_count: count(schema.cards.id).as("card_count"),
    })
    .from(schema.decks)
    .leftJoin(schema.cards, eq(schema.decks.id, schema.cards.did))
    .groupBy(schema.decks.id))

  return (
    // <Suspense fallback={}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        // useSuspense
      >
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
        </Stack>
      </SQLiteProvider>
    //  </Suspense>

  );
}
