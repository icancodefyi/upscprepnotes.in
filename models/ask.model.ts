import mongoose, { Schema, Document } from "mongoose";

export interface IAskMessage {
  role: "user" | "assistant";
  content: string;
  sources?: { slug: string; name: string }[];
}

export interface IAskConversation extends Document {
  sessionId: string;
  userId: string | null;
  title: string;
  messages: IAskMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAskSession extends Document {
  sessionId: string;
  userId: string | null;
  queriesToday: number;
  lastQueryAt: Date | null;
}

const AskMessageSchema = new Schema<IAskMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    sources: [{ slug: String, name: String }],
  },
  { _id: false },
);

const AskConversationSchema = new Schema<IAskConversation>(
  {
    sessionId: { type: String, required: true, index: true },
    userId: { type: String, default: null, index: true },
    title: { type: String, default: "New Chat" },
    messages: [AskMessageSchema],
  },
  { timestamps: true },
);

AskConversationSchema.index({ sessionId: 1, updatedAt: -1 });
AskConversationSchema.index({ userId: 1, updatedAt: -1 });

const AskSessionSchema = new Schema<IAskSession>(
  {
    sessionId: { type: String, required: true, unique: true },
    userId: { type: String, default: null, index: true },
    queriesToday: { type: Number, default: 0 },
    lastQueryAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const AskConversationModel =
  mongoose.models?.AskConversation ||
  mongoose.model<IAskConversation>("AskConversation", AskConversationSchema);

export const AskSessionModel =
  mongoose.models?.AskSession ||
  mongoose.model<IAskSession>("AskSession", AskSessionSchema);
