import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import {
  openDatabaseSync,
  SQLiteProvider,
} from "expo-sqlite";
import React, { Suspense, useEffect } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "@/drizzle/migrations";
import * as schema from "@/db/schema";
import { Stack } from "expo-router";
import * as Filesystem from 'expo-file-system'
import { View, Text } from "react-native";

export const DATABASE_NAME = "collection.anki2";
const expoDb = openDatabaseSync(DATABASE_NAME,undefined,Filesystem.documentDirectory!);
const db = drizzle(expoDb, { schema });

export default function RootLayout() {
  
  const { success, error } = useMigrations(db, migrations);



  return (
    // <Suspense fallback={}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        directory={Filesystem.documentDirectory!}
        // useSuspense
      >
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Home' }} />
        </Stack>
      </SQLiteProvider>
    //  </Suspense>

  );
}
