"use client";
import "@/app/chat.css";
import InstitutionalShell from "./institutional-shell";
import Chat from "./fitness-chat";
export default function InstitutionalChat() {
  return (
    <InstitutionalShell page="assistente">
      <section className="inst-chat-page">
        <h1 className="inst-chat-heading">
          Fitness AI <span>Seu assistente para conhecer o projeto.</span>
        </h1>
        <Chat />
      </section>
    </InstitutionalShell>
  );
}
