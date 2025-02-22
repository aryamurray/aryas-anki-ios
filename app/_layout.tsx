import { drizzle } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import {
  openDatabaseAsync,
  openDatabaseSync,
  SQLiteProvider,
} from "expo-sqlite";
import { Suspense, useEffect } from "react";
import { ActivityIndicator, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as schema from "@/db/schema";
import { NavigationContainer } from "@react-navigation/native";

export const DATABASE_NAME = "collection.anki2";

export default function Layout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb, { schema });
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    // Define an async function to fetch cards
    const fetchCards = async () => {
      try {
        // Await the result of the query
        const cards = await db.query.cards.findMany();
        // Log the fetched cards
        console.log("Cards Found:", cards);
      } catch (error) {
        // Handle any errors
        console.error("Error fetching cards:", error);
      }
    };

    // Call the async function
    // fetchCards();

    console.log("Success:",success)
    console.log('Error:',error)

  }, [success, error]); // Empty dependency array ensures this runs only once on mount

  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
        <StatusBar />
      </SQLiteProvider>
    </Suspense>
  );
}
