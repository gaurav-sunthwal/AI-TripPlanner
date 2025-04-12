import { pgTable, varchar, integer, text } from "drizzle-orm/pg-core";

export const tripDitails = pgTable("tripDitails", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  tripName: varchar("tripName", { length: 255 }).notNull(),
  tripId: varchar("tripId", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 255 }).notNull(),
  travelers: varchar("travelers", { length: 255 }).notNull(),
  date: varchar("date", { length: 255 }).notNull(),
  tripData: text("tripData").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});
